import fs from 'fs';
import apolloServerKoa from 'apollo-server-koa';
import lowdb from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import mkdirp from 'mkdirp';
import promisesAll from 'promises-all';
import shortid from 'shortid';

import axios from 'axios';
import FormData from 'form-data';
import concat from 'concat-stream';
import qs from "qs";

const UPLOAD_DIR = './uploads';
const db = lowdb(new FileSync('db.json'));

// Seed an empty DB.
db.defaults({ uploads: [] }).write();

// Ensure upload directory exists.
mkdirp.sync(UPLOAD_DIR);

const storeFS = ({ stream, filename }) => {
    const id = shortid.generate();
    const path = `${UPLOAD_DIR}/${id}-${filename}`;
    return new Promise((resolve, reject) =>
        stream
            .on('error', error => {
                if (stream.truncated) {
                    // Delete the truncated file.
                    fs.unlinkSync(path);
                }
                reject(error);
            })
            .pipe(fs.createWriteStream(path))
            .on('error', error => reject(error))
            .on('finish', () => resolve({ id, path }))
    );
};

const storeDB = file =>
    db
        .get('uploads')
        .push(file)
        .last()
        .write();

const uploadFileOnOak = (path, nodePath) => {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('upPath', nodePath);
        formData.append('file', fs.createReadStream(path));
        console.log("Sending: multipart request");
        formData.pipe(concat({ encoding: 'buffer' }, async data => {
            let suc = false;
            try {
                const res = await axios.post(process.env.OAK_SERVER + '/oakRepo/upload', data, {
                    headers: formData.getHeaders()
                });
                if (res && res.data) {
                    console.log("Upload Res: ", res.data);
                    resolve(res.data);
                    suc = true;
                }
            } catch (err) {
                console.log("Upload Err: ", err);
                reject(err);
                suc = true;
            } finally {
                if (!suc) {
                    reject(new Error('Unexpected error occured.'));
                }
            }
        }));
    });
};

const createFileNodeInOak = (nodePath, filename, mimetype, upPath) => {
    return new Promise((resolve, reject) => {
        const params = {
            parentPath: nodePath,
            json: JSON.stringify({
                jcrPath: nodePath,
                name: filename,
                contentType: mimetype,
                path: upPath
            }),
            cls: 'com.synectiks.commons.entities.oak.OakFileNode',
            nodeName: filename
        };
        console.log("Sending: ", params);
        axios.post(process.env.OAK_SERVER + '/oakRepo/createNode', qs.stringify(params))
            .then((response) => {
                console.log("Upload: ", response.data);
                resolve(response.data);
            }).catch(function (error) {
                console.log("Create Err: ", error);
                reject(error);
            });
    });
};

const waitFor = (delay) => {
    return new Promise((resolve, reject) => {
        const res = 'Success';
        try {
            setTimeout(() => {
                resolve(res);
            }, delay);
        } catch (err) {
            reject(err);
        }
    });
};

const processUpload = async upload => {
    const { createReadStream, filename, mimetype } = await upload;
    const stream = createReadStream();
    const { id, path } = await storeFS({ stream, filename });
    await waitFor(1000);
    // ADD logic to upload file on oak-server
    const nodePath = process.env.NODEPATH + id.replace(/[\W_]/g, '');
    const upPath = await uploadFileOnOak(path, nodePath);
    await createFileNodeInOak(nodePath, filename, mimetype, upPath);
    return storeDB({ id, filename, mimetype, path, nodePath });
};

export default {
    Upload: apolloServerKoa.GraphQLUpload,
    Query: {
        uploads: () => db.get('uploads').value()
    },
    Mutation: {
        singleUpload: (obj, { file }) => processUpload(file),
        async multipleUpload(obj, { files }) {
            const { resolve, reject } = await promisesAll.all(
                files.map(processUpload)
            );

            if (reject.length) {
                reject.forEach(({ name, message }) =>
                    // eslint-disable-next-line no-console
                    console.error(`${name}: ${message}`)
                );
            }

            return resolve;
        }
    }
};
