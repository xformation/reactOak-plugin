
export default class ActionHandler {

	static PageTypes = {
		SURVEY: 'surveyjs',
		DYN_FRM: 'dynamicform'
	}

	constructor() {
		this.execute = this.execute.bind(this);
		this.getPageJson = this.getPageJson.bind(this);
		this.getPageType = this.getPageType.bind(this);
		this.dynamicProps = this.dynamicProps.bind(this);
		this.getSelectedState = this.getSelectedState.bind(this);
	}

	dynamicProps() {
		// override it to return actual action hadlers.
		return {};
	}

	getSelectedState() {
		// override it to return selected state
		return {};
	}

	getPageJson() {
		console.log("You have called default action so no view data.");
		return {};
	}

	getPageType() {
		return ActionHandler.PageTypes.DYN_FRM;
	}

	execute(data) {
		console.log("Calling action handler execute with input data: ", data);
	}

}
