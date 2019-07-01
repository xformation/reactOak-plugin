import React from 'react';

import * as Survey from "survey-react";
import "survey-react/survey.css";
Survey.StylesManager.applyTheme("default");

export default class SurveyModal extends React.Component {

	constructor(props) {
		super(props);

		this.id = this.props.id;
		this.data = this.props.data;
		this.handlr = this.props.handler;

		this.onComplete = this.onComplete.bind(this);
	}

	onComplete(result) {
		console.log(this.id + " form complete: ", result);
	}

	render() {
		console.log("Data", this.data);
		return (
			<Survey.Survey json={this.data} showCompletePage="false" onComplete={this.onComplete} />
		);
	}

}
