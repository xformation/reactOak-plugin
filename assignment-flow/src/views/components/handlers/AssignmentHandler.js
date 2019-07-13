import Utils from './../../../utils/Utils';
import ActionHandler from './ActionHandler';
import DynamicForm from './../../components/modals/DynamicForm';

const DNL_URL = '/oakRepo/download';

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

export default class AssignmentHandler extends ActionHandler {

	constructor(input) {
		super();
		this.data = {};
		this.state = {
			url: input.url,
			ssmState: input.selState,
			student: input.student
		}
		this.execute = this.execute.bind(this);
		this.getPageJson = this.getPageJson.bind(this);
		this.getPageType = this.getPageType.bind(this);
		this.getSelectedState = this.getSelectedState.bind(this);
	}

	getSelectedState() {
		return this.state.ssmState;
	}

	getPageJson() {
		// Dynamic-Form page input json
		if (this.state.student) {
			switch(this.state.student.name) {
				case 'Download':
					return downloadJSON;
				case 'Upload':
					return downloadJSON;
				case 'Preview':
					return downloadJSON;
				case 'Submit':
					return downloadJSON;
				default:
					return downloadJSON;
			}
		}
	}

	execute(data) {
		this.data = data;
		console.log("Calling assignment handler execute", this.data, this.state);
		// call Jcr oak to download the assignment
		const path = Utils.getFileNodePath(/*this.state.assignment.id*/
			1, this.data.subject, this.state.student.id);
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
