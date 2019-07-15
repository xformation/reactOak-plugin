import React from 'react';
import './../../../style/App.css';
import DynamicForm from './DynamicForm';
import Utils from './../../../utils/Utils';
import { Redirect } from "react-router-dom";

import * as Survey from "survey-react";
import "survey-react/survey.css";
import "../surveyjs/SurveyJsButton";
import ActionHandler from '../handlers/ActionHandler';
Survey.StylesManager.applyTheme("default");

export default class ModalView extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			close: false,
			usrData: this.props.location
		}

		this.onComplete = this.onComplete.bind(this);
	}

	onComplete(result) {
		console.log("Complete! ", result);
		const selState = this.state.usrData.handler.getSelectedState();
		// Send event to mark state complete in state machine.
		const machineId = Utils.getSSMachineId('SubId-' + this.state.usrData.assignment.subject,
			1 /*this.state.usrData.assignment.id*/, this.state.usrData.student.id);
		const params = "machineId=" + machineId + "&event=" +  selState.event;
		console.log("params: ", params);
		Utils.postReq(process.env.REACT_APP_SSM + "/ssm/states/sendEvent?" + params, {})
			.then((res) => {
				console.log('is sendEvent successful: ', res);
				// Close model dialog
				this.setState({
					close: true
				});
			})
			.catch((err) => {
				console.error('Failed to fetch /ssm/states/sendEvent', err);
			});
	}

	render() {
		const data = this.state.usrData.handler ? this.state.usrData.handler.getPageJson() : null;
		if (this.state.close) {
			console.log("Sel: ", this.assign);
			return (
				<Redirect push
					to={{
						pathname: "/wizard",
						assignment: this.state.usrData.assignment
					}} 
				/>);
		} else if (data && this.state.usrData.handler) {
			const pgType = this.state.usrData.handler.getPageType();
			const dprops = this.state.usrData.handler.dynamicProps();
			if (pgType === ActionHandler.PageTypes.DYN_FRM) {
				return (
					<div className="divLoader">
						<DynamicForm json={data} {...dprops} onSubmit={this.onComplete}/>
					</div>
				);
			} else {
				return (
					<div>
						<Survey.Survey json={data} showCompletePage="false" onComplete={this.onComplete} />
					</div>
				);
			}
		} else {
			return (
				<div className="divLoader">
					<p>
						Retry the action to get it working.<br/>
						Either refresh or go back to get the view rendered.
						<br/>
						<button onClick={this.onComplete}>Close</button>
					</p>
				</div>
			);
		}
	}

}
