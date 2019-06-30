import ActionHandler from './ActionHandler';
import AssignmentHandler from './AssignmentHandler';

export default class ActionFactory {

	static Actions = {
		ASSIGNMENT: 'Assignment'
	}

	static getHandlerInstance (actionName, arg) {
		console.log('Handler name: ' + actionName);
		switch(actionName) {
			case ActionFactory.Actions.ASSIGNMENT:
				return new AssignmentHandler(arg);
			default:
				return new ActionHandler(arg);
		}
	}

}
