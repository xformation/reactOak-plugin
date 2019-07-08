import ActionHandler from './ActionHandler';

const downloadJSON = {
	title: 'Download the Assignment',
	elements: [
		{
			type: "surveybutton",
			name: "download",
			buttonText: "Download...",
			url: 'http://localhost:8094/download',
			startWithNewLine: true
		},
		{
			type: "checkbox",
			name: "checked",
			title: 'Confirm',
			isRequired: true,
			choices: ['I had downloaded the assignments, successfully.'],
			startWithNewLine: false
		}
	]
};

export default class AssignmentHandler extends ActionHandler {

	constructor(state) {
		super();
		this.data = {};
		this.ssmState = state;
	}

	getPageJson() {
		// Survey-js page input json
		if (this.ssmState) {
			switch(this.ssmState.name) {
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
		console.log("Calling assignment handler execute", data);
	}

}
