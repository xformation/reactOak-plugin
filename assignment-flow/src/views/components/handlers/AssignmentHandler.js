import ActionHandler from './ActionHandler';

export default class AssignmentHandler extends ActionHandler {

	constructor(state) {
		super();
		this.data = {};
		this.ssmState = state;
	}

	getPageJson() {
		// Survey-js page input json
		return {
			title: "Create New Rule",
			elements: [
				{
					type: "text",
					name: "name",
					title: "Enter Rule Name ...",
					isRequired: true,
					maxLength: 50,
					startWithNewLine: false
				},
				{
					type: "text",
					name: "entity",
					title: "Enter entity name to be search",
					isRequired: true,
					maxLength: 50,
					startWithNewLine: false
				},
				{
					type: "comment",
					name: "description",
					title: "Enter rule desrption...",
				},
				{
					
					type: "multipletext",
					name: "checks",
					items: [
						{ name: "check1" }
					]
				},
				{
					type: "surveybutton",
					name: "addMore",
					buttonText: "Add More Checks...",
					startWithNewLine: false
				}
			]
		};
	}

	execute(data) {
		this.data = data;
		console.log("Calling assignment handler execute", data);
	}

}
