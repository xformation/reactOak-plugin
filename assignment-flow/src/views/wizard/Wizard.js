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
			assign: this.props.location.assignment,
			subject: {},
			jsonData: {},
			isLoading: true,
			showModel: false,
			stateData: []
		};

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
		if (this.state.assign) {
			this.SSMID = 'SubId-' + this.state.assign.subject;
			const path = LIST_STATES + '?ssmId=' + this.SSMID;
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
					this.fetchCurState(this.state.assign.id, Utils.studentData.id);
				}).catch((err) => {
					console.error('Failed to fetch ' + LIST_STATES, err);
				});
		}
	}

	fetchCurState(asignId, studentId) {
		const machineId = Utils.getSSMachineId(this.SSMID, asignId, studentId);
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
		if (this.state.assign) {
			console.log("Assign: ", this.state.assign);
			const subject = Utils.getObjectById(
				Utils.dataJson.subjects, parseInt(this.state.assign.subject));
			this.setState({
				subject: subject
			});
		}
	}

	clickHandler(item) {
		console.log("You had selected state: ", item);
		if (!this.handler) {
			const data = {
				url: process.env.REACT_APP_OAK_URL,
				student: Utils.studentData,
				selState: item
			}
			this.handler = ActionFactory.getHandlerInstance(
				ActionFactory.Actions.ASSIGNMENT, data);
		}
		this.setState({
			showModel: true
		});
	}

	render() {
		if (this.state.isLoading) {
			return (
				<div className="divLoader">
					<img src="/images/loader.gif" alt="Loader" />
				</div>
			);
		} else if (this.state.showModel) {
			const hndlr = this.handler;
			const asign = this.state.assign;
			return (
				<Redirect push
					to={{
						pathname: "/modal",
						handler: hndlr,
						assignment: asign,
						student: Utils.studentData
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
							entity={Utils.studentData} clickHandler={this.clickHandler} />
					</div>
				</div>
			);
		}
	}
}
