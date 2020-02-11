import Utils from './../../../utils/Utils';
import ActionHandler from './ActionHandler';
import DynamicForm from './../../components/modals/DynamicForm';

const DNL_URL = '/api/oakRepo/download';
const UPL_URL = '/api/oakRepo/upload';
const CRT_URL = '/api/oakRepo/createNode';

const downloadJSON = {
	title: 'Dyanmic Form',
	controls: [
		{
			type: DynamicForm.ControlTypes.LABEL,
			name: 'lablInfo',
			text: 'Download the Assignment'
		}, {
			type: DynamicForm.ControlTypes.BUTTON,
			name: 'download',
			text: 'Download...',
			hasaction: true
		}, {
			type: DynamicForm.ControlTypes.CHECKBOX,
			name: "downloaded",
			text: 'I had downloaded the assignments, successfully.',
			isRequired: true
		}
	]
};
const uploadJSON = {
	title: 'Upload Assignment',
	controls: [
		{
			type: DynamicForm.ControlTypes.FILE,
			name: 'file',
			text: 'Upload the Assignment',
			isRequired: true
		}, {
			type: DynamicForm.ControlTypes.BUTTON,
			name: 'upload',
			text: 'Upload...',
			hasaction: true
		}, {
			type: DynamicForm.ControlTypes.CHECKBOX,
			name: "uploaded",
			text: 'I had uploaded the assignments, successfully.',
			isRequired: true
		}
	]
};

export default class AssignmentHandler extends ActionHandler {

	constructor(input) {
		super();
		this.state = {
			url: input.url,
			ssmState: input.selState,
			student: input.student
		}
		this.execute = this.execute.bind(this);
		this.getPageJson = this.getPageJson.bind(this);
		this.getPageType = this.getPageType.bind(this);
		this.dynamicProps = this.dynamicProps.bind(this);
		this.getSelectedState = this.getSelectedState.bind(this);
		// action handler methods
		this.downloadFile = this.downloadFile.bind(this);
		this.uploadFile = this.uploadFile.bind(this);
	}

	getSelectedState() {
		return this.state.ssmState;
	}

	dynamicProps() {
		// Dynamic-Form page input props
		if (this.state.ssmState) {
			switch(this.state.ssmState.name) {
				case 'Download':
					return {// enforce to call execute by default
						// inputs like: 'downloadOnClick': {this.downloadFile}
					};
				case 'Upload':
					return {};
				case 'Preview':
					return {};
				case 'Submit':
					return {};
				default:
					return super.dynamicProps();
			}
		}
		return super.dynamicProps();
	}

	getPageType() {
		// Dynamic-Form page input json
		// if (this.state.ssmState) {
		// 	switch(this.state.ssmState.name) {
		// 		case 'Download':
		// 			return ActionHandler.PageTypes.DYN_FRM;
		// 		case 'Upload':
		// 			return ActionHandler.PageTypes.DYN_FRM;
		// 		case 'Preview':
		// 			return ActionHandler.PageTypes.DYN_FRM;
		// 		case 'Submit':
		// 			return ActionHandler.PageTypes.DYN_FRM;
		// 		default:
		// 			return super.getPageType();
		// 	}
		// }
		return super.getPageType();
	}

	getPageJson() {
		// Dynamic-Form page input json
		if (this.state.ssmState) {
			switch(this.state.ssmState.name) {
				case 'Download':
					return downloadJSON;
				case 'Upload':
					return uploadJSON;
				case 'Preview':
					return downloadJSON;
				case 'Submit':
					return downloadJSON;
				default:
					return super.getPageJson();
			}
		}
		return super.getPageJson();
	}

	execute(data) {
		console.log("Calling assignment handler execute", data, this.state);
		// Dynamic-Form page input json
		if (this.state.ssmState) {
			switch(this.state.ssmState.name) {
				case 'Download':
					this.downloadFile(data.assignment);
					break;
				case 'Upload':
					this.uploadFile(data.assignment, data.input);
					break;
				case 'Preview':
					this.downloadFile();
					break;
				case 'Submit':
					this.downloadFile();
					break;
				default:
					super.execute();
					break;
			}
		}
	}

	uploadFile(assignment, input) {
		const aid = assignment.id;
		const subid = assignment.subject;
		const path = Utils.getFileNodePath(aid, subid, this.state.student.id);
		const formData = new FormData();
		formData.append('upPath', path);
		formData.append('file', input.file);
		const jFile = {
			name: input.file.name,
			contentType: input.file.type
		};
		const url = this.state.url + UPL_URL + "?upPath=" + path;
		console.log("Calling: ", url, formData);
		Utils.postReq(url, formData, { headers: {'content-type': 'multipart/form-data' }})
			.then((res) => {
				console.log("uploaded at: " + res.data);
				// create jcr file node for this path.
				Utils.createNodeInOak(this.state.url + CRT_URL, path, jFile, res.data);
			}).catch((err) => {
				console.error('Failed to post ' + UPL_URL, err);
			});
	}

	downloadFile(assignment) {
		// call Jcr oak to download the assignment
		const path = Utils.getFileNodePath(assignment.id);
		const url = this.state.url + DNL_URL + "?path=" + path;
		console.log("Url:" + url);
		Utils.postReq(url, {}, {responseType: 'blob', headers: {Accept: 'application/*'}})
			.then((res) => {
				if (res && res.headers) {
					//console.log("Headers: ", res);
					let fileName = res.headers['x-suggested-filename'];
					if (!fileName) {
						fileName = res.headers["content-disposition"].split("filename=")[1];
					}
					if (window.navigator && window.navigator.msSaveOrOpenBlob) { // IE variant
						window.navigator.msSaveOrOpenBlob(
							new Blob([res.data],
								{type: res.headers['content-type']}), fileName);
					} else {
						const url = window.URL.createObjectURL(
							new Blob([res.data], {type: res.headers['content-type']}));
						const link = document.createElement('a');
						link.href = url;
						link.setAttribute('download', fileName);
						document.body.appendChild(link);
						link.click();
					}
				} else {
					console.log("Invalid response: ", res);
				}
			})
			.catch((err) => {
				console.error('Failed to fetch ' + DNL_URL, err);
			});
	}

}
