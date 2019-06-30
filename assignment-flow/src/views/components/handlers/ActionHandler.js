
export default class ActionHandler {

	getPageJson() {
		console.log("You have called default action so no view data.");
		return {};
	}

	execute(data) {
		console.log("Calling action handler execute with input data: ", data);
	}

}
