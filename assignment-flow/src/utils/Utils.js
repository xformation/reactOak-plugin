import axios from 'axios';

export default class Utils {

	static studentData = {
		id: 1,
		name: 'Rajesh',
		department: 1,
		course: 'MCA',
		year: 3
	}

	static dataJson = {
		acadamicYear: 2019,
		departments: [
			{
				id: 1,
				name: 'Computer Science'
			}, {
				id: 2,
				name: 'Information Technology'
			}
		],
		subjects: [
			{
				id: 0,
				name: '--Select--'
			}, {
				id: 1,
				name: 'Operating System',
				department: 1
			}, {
				id: 2,
				name: 'Database System',
				department: 1
			}, {
				id: 3,
				name: 'Web Technology',
				department: 1
			}, {
				id: 4,
				name: 'Programming Language',
				department: 1
			}
		],
		assignments: [
			{
				id: 1,
				assignment: 'OS-Assignemnt',
				marks: 50,
				department: 1,
				subject: 1,
				year: 1,
				section: 'A',
				teacher: 'Papu',
				type: 'Offline'
			}, {
				id: 3,
				assignment: 'Web-Assignemnt',
				marks: 50,
				department: 1,
				subject: 3,
				year: 1,
				section: 'A',
				teacher: 'Papu',
				type: 'Offline'
			}, {
				id: 2,
				assignment: 'JS-Assignemnt',
				marks: 50,
				department: 1,
				subject: 4,
				year: 1,
				section: 'A',
				teacher: 'Papu',
				type: 'Offline'
			}, {
				id: 4,
				assignment: 'DS-Assignemnt',
				marks: 50,
				department: 1,
				subject: 2,
				year: 1,
				section: 'A',
				teacher: 'Papu',
				type: 'Offline'
			}
		]
	};

	static getFileNodePath(asignId, subId, studentId) {
		let path = '/synectiks/cms/assignments/' + asignId;
		if (subId) {
			path += '/sub/' + subId;
		}
		if (studentId) {
			path += '/student/' + studentId;
		}
		return path;
	}

	static getSSMachineId(ssmid, asignId, studentId) {
		return ssmid + ":" + asignId + "-" + studentId;
	}

	static addAtIndex(arr,  index, item ) {
		arr.splice( index, 0, item );
	}

	static firstLatterCapital(str) {
		return str.replace(/^\w/, c => c.toUpperCase());
	}

	static getReactTableColObj(key, acesor) {
		const upper = Utils.firstLatterCapital(key);
		return {
			Header: upper,
			accessor: acesor,
			sortable: true,
			filterable: true
		};
	}

	static getStatesSet(stateData) {
		const arr = [];
		console.log("input: ", stateData);
		stateData.forEach((item) => {
			if (item.initial) {
				Utils.addAtIndex(arr, 0, item);
			} else {
				let indx = Utils.arrayItemHasKeyValue(
					arr, 'name', item.target);
				if (indx >= 0) {
					Utils.addAtIndex(arr, indx, item);
				} else {
					arr.push(item);
				}
			}
		});
		console.log("output: ", arr);
		return arr;
	}

	static arrayItemHasKeyValue(arr, key, val) {
		const res = {res: -1};
		arr.map( (item, indx) => {
			if (item[key] === val) {
				res.res = indx;
			}
			return item;
		});
		console.log("Res: ", res.res);
		return res.res;
	}

	static arrayHasObject(arr, obj) {
		const res = {res: false};
		arr.map( (item) => {
			if (item.Header === obj.Header) {
				res.res = true;
			}
			return item;
		});
		console.log("Res: ", res.res);
		return res.res;
	}

	static getObjectById(arr, val) {
		const obj = {};
		arr.forEach((s) => {
			if (s.id === val) {
				obj.item = s;
			}
		});
		return obj.item;
	}

	static postReq(url, data, opts = {}) {
		return new Promise((resolve, reject) => {
			axios.post(
				url,
				data,
				opts
			).then((response) => {
				resolve(response);
			}).catch((error) => {
				console.error("POST Err: ", error);
				reject(error);
			});
		});
	}

	static getReq(url) {
		return new Promise((resolve, reject) => {
			axios.get(url).then((response) => {
				resolve(response);
			}).catch((error) => {
				console.error("GET Err: ", error);
				reject(error);
			});
		});
	}

	static createNodeInOak(url, nodePath, file, sPath) {
		const data = new FormData();
		data.append('parentPath', nodePath);
		if (file && sPath) {
			file.path = sPath;
			data.append('json', JSON.stringify(file));
			data.append('cls', 'com.synectiks.commons.entities.oak.OakFileNode');
		} else {
			data.append('json', file);
		}
		data.append('nodeName', nodePath.substring(nodePath.lastIndexOf('/') + 1));
		Utils.postReq(url, data, {})
			.then((res) => {
				console.log('Successfully created node: ', res.data);
			})
			.catch((err) => {
				console.error('Failed to fetch ' + url, err);
			});
	}

}
