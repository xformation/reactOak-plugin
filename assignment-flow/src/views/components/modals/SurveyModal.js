import React from 'react';
import { Redirect } from "react-router-dom";

import * as Survey from "survey-react";
import "survey-react/survey.css";
Survey.StylesManager.applyTheme("default");

export default class SurveyModal extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			close: false
		}

		this.data = this.props.location.data;
		this.handlr = this.props.location.handler;
		this.asign = this.props.location.asgn;

		this.onComplete = this.onComplete.bind(this);
	}

	onComplete(result) {
		console.log("Complete! ", result);
		this.setState({
			close: true
		});
	}

	render() {
		if (this.state.close) {
			console.log("Sel: ", this.assign);
			return (
				<Redirect push
					to={{
						pathname: "/wizard",
						assignment: this.assign
					}} 
				/>);
		} else {
			return (
				<div>
					<Survey.Survey json={this.data} showCompletePage="false" onComplete={this.onComplete} />
					<button onClick={this.closeModal}>Cancel</button>
				</div>
			);
		}
	}

}
