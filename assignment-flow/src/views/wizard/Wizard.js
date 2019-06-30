import React from 'react';
import './../../style/App.css';
import '../../style/assignment.css';
import Utils from './../../utils/Utils';
import { Redirect } from "react-router-dom";
import Slider from '../components/slider/Slider';
import ActionFactory from './../components/handlers/ActionFactory';

export default class Wizard extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			assign: {},
			subject: {},
			jsonData: {},
			showModel: false
		};
		this.asgn = this.props.location.assignment;

		this.select = this.select.bind(this);
		this.setSubject = this.setSubject.bind(this);
		this.clickHandler = this.clickHandler.bind(this);
	}

	componentDidMount() {
		this.setSubject();
	}

	setSubject() {
		// Set page objects
		if (this.asgn) {
			console.log("Assign: ", this.asgn);
			const subject = Utils.getObjectById(
				Utils.dataJson.subjects, parseInt(this.asgn.subject));
			this.setState({
				assign: this.asgn,
				subject: subject
			});
		}
	}

	clickHandler(item) {
		console.log("You had selected state: ", item);
		if (!this.handler) {	
			this.handler = ActionFactory.getHandlerInstance(
				ActionFactory.Actions.ASSIGNMENT, item);
		}
		const json = this.handler.getPageJson();
		console.log("json: ", json);
		//this.handler.execute();
		this.setState({
			jsonData: json,
			showModel: true
		});
	}

	select() {
		console.log("You had selected an assignment.");
	}

	render() {
		if (this.state.showModel) {
			const dt = this.state.jsonData;
			const hndlr = this.handler;
			const asign = this.asgn;
			console.log("data: ", dt);
			return (
				<Redirect push
					to={{
						pathname: "/survey",
						data: dt,
						handler: hndlr,
						assignment: asign
					}} 
				/>);
		} else {
			return (
				<div className="wizard">
					<p>Acadmic Year <b>{Utils.dataJson.acadamicYear}</b></p>
					<div className="root">
						<p>Student: <b>{Utils.studentData.name}</b></p>
						<p>
							Subject: <b>{this.state.subject ? this.state.subject.text : ''}</b>
						</p>
						<p>
							Assigment: <b>{this.state.assign ? this.state.assign.assignment : ''}</b>
						</p>
						<Slider data={Utils.stateData}
							entity={Utils.studentData} clickHandler={this.clickHandler}/>
					</div>
				</div>
			);
		}
	}
}
