
export default class Utils {

	static sliderData = [
		{
			id: 1,
			text: 'Download',
			status: 'Y',
			active: false
		}, {
			id: 2,
			text: 'Upload',
			status: 'N',
			active: true
		}, {
			id: 3,
			text: 'Preview',
			status: 'N',
			active: false
		}, {
			id: 4,
			text: 'Submit',
			status: 'N',
			active: false
		}
	];

	static dataJson = {
		acadamicYear: 2019,
		departments: [
			{
				id: 1,
				text: 'Computer Science'
			}, {
				id: 2,
				text: 'Information Technology'
			}
		],
		subjects: [
			{
				id: 0,
				text: '--Select--'
			}, {
				id: 1,
				text: 'Operating System',
				department: 1
			}, {
				id: 2,
				text: 'Database System',
				department: 1
			}, {
				id: 3,
				text: 'Web Technology',
				department: 1
			}, {
				id: 4,
				text: 'Programming Language',
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
		console.log("val: ", val);
		arr.forEach((s) => {
			if (s.id === val) {
				obj.item = s;
			}
		});
		return obj.item;
	}

}
