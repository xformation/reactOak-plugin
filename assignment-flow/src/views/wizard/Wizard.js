import React from 'react';
import './../../style/App.css';
import '../../style/assignment.css';
import Utils from './../../utils/Utils';
import { Redirect } from "react-router-dom";
import Slider from '../components/slider/Slider';
import ActionFactory from './../components/handlers/ActionFactory';

const CUR_STATE = '/ssm/states/currentState';
const LIST_STATES = '/ssm/states/listBySsmId';

export default class Wizard extends React.Component {

	// State machine name holder
	SSMID = null;

	constructor(props) {
		super(props);

		this.state = {
			assign: {},
			subject: {},
			jsonData: {},
			isLoading: true,
			showModel: false,
			stateData: []
		};
		this.asgn = this.props.location.assignment;

		this.select = this.select.bind(this);
		this.setSubject = this.setSubject.bind(this);
		this.clickHandler = this.clickHandler.bind(this);
		this.setSsmStates = this.setSsmStates.bind(this);
		this.fetchCurState = this.fetchCurState.bind(this);
		this.updateStateData = this.updateStateData.bind(this);
	}

	componentDidMount() {
		this.setSubject();
		this.setSsmStates();
	}

	setSsmStates() {
		if (this.asgn) {
			this.SSMID = 'SubId-' + this.asgn.subject;
			const path = LIST_STATES + '?ssmId=SubId-' + this.asgn.subject;
			Utils.getReq(process.env.REACT_APP_SSM + path)
				.then((res) => {
					console.log('Res: ', res);
					if (res && Array.isArray(res.data)) {
						const arr = Utils.getStatesSet(res.data);
						this.setState({
							stateData: arr,
							isLoading: false
						});
					} else {
						console.warn('Invalid response for ' + LIST_STATES);
					}
					this.fetchCurState(this.asgn.id, Utils.studentData.id);
				}).catch((err) => {
					console.error('Failed to fetch ' + LIST_STATES, err);
				});
		}
	}

	fetchCurState(asignId, studentId) {
		const machineId = this.SSMID + ":" + asignId + "-" + studentId;
		const data = {
			machineId: machineId
		}
		Utils.postReq(process.env.REACT_APP_SSM + CUR_STATE + "?machineId=" + machineId, data)
			.then((res) => {
				console.log('Current State: ', res);
				this.updateStateData(res.data);
			})
			.catch((err) => {
				console.error('Failed to fetch ' + CUR_STATE, err);
			});
	}

	updateStateData(curState) {
		const arr = this.state.stateData;
		const ind = Utils.arrayItemHasKeyValue(arr, 'name', curState);
		if (ind >= 0) {
			arr.map((item, index) => {
				if (ind === index) {
					item.active = true;
				} else if (index < ind) {
					item.status = 'Y';
				}
				return item;
			});
		}
		this.setState({
			stateData: arr
		});
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
		this.setState({
			jsonData: json,
			showModel: true
		});
	}

	select() {
		console.log("You had selected an assignment.");
	}

	render() {
		if (this.state.isLoading) {
			return (
				<div className="divLoader">
					<img src="/images/loader.gif" alt="Loader"/>
				</div>
			);
		} else if (this.state.showModel) {
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
							Subject: <b>{this.state.subject ? this.state.subject.name : ''}</b>
						</p>
						<p>
							Assigment: <b>{this.state.assign ? this.state.assign.assignment : ''}</b>
						</p>
						<Slider data={this.state.stateData}
							entity={Utils.studentData} clickHandler={this.clickHandler}/>
					</div>
				</div>
			);
		}
	}
}
