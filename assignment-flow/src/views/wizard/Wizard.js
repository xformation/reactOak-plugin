import React from 'react';
import './../../style/App.css';
import '../../style/assignment.css';
import Utils from './../../utils/Utils';
import Slider from './../components/Slider';

export default class Wizard extends React.Component {

	constructor(props) {
		super(props);

		this.select = this.select.bind(this);
		this.setSubject = this.setSubject.bind(this);
		this.clickHandler = this.clickHandler.bind(this);
	}

	setSubject(asign) {
		// Set page objects
		if (asign) {
			console.log("Asign: ", asign);
			this.subject = Utils.getObjectById(
				Utils.dataJson.subjects, parseInt(asign.subject));
		}
	}

	clickHandler(item) {
		console.log("You had selected state: ", item);
	}

	select() {
		console.log("You had selected an assignment.");
	}

	render() {
		this.assign = this.props.location.assignment;
		console.log("Assignment: ", this.assign);
		this.setSubject(this.assign);
		return (
			<div className="wizard">
				<p>Acadmic Year <b>{Utils.dataJson.acadamicYear}</b></p>
				<div>
					<p>Subject: <b>{this.subject ? this.subject.text : ''}</b></p>
					<p>Assigment: <b>{this.assign ? this.assign.assignment : ''}</b></p>
					<Slider data={Utils.sliderData} clickHandler={this.clickHandler}/>
				</div>
			</div>
		);
	}
}
