import { graphql } from 'react-apollo';
import uploadsQuery from '../queries/uploads';
import { Table, Head, Cell } from './Table';

import fs from 'fs';

const Uploads = ({ data: { uploads = [] } }) => {
    uploads.map(({ id, path, nodePath }) => {
        fs.access(path, fs.F_OK, (err) => {
            if (err) {
                console.error(err);
                const fPath = nodePath + "/" + path.substring(path.lastIndexOf("/") + 1);
                axios.post(process.env.OAK_SERVER + "/download", {
                    path: fPath
                }).then((response) => {
                    console.log("Headers: ", response.headers);
                }).catch(function (error) {
                    console.log("Create Err: ", error);
                });
            }
            //file exists
        });
    });
    return (
        <Table
            thead={
                <tr>
                    <Head>Filename</Head>
                    <Head>MIME type</Head>
                    <Head>Path</Head>
                </tr>
            }
            tbody={uploads.map(({ id, filename, mimetype, path }) => (
                <tr key={id}>
                    <Cell>{filename}</Cell>
                    <Cell>{mimetype}</Cell>
                    <Cell>{path}</Cell>
                </tr>
            ))}
        />
    );
}

export default graphql(uploadsQuery)(Uploads);
