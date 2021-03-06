import React from 'react';
import './../../style/App.css';
import { Redirect } from "react-router-dom";

export default class Home extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			clicked: false
		};
		this.onClick = this.onClick.bind(this);
	}

	onClick() {
		this.setState({
			clicked: true
		});
	}

	render() {
		if (this.state.clicked === true) {
			return (
				<Redirect push
					to={{
						pathname: "/assignment"
					}}
				/>);
		} else {
			return (
				<div key="bDivApp" className="App" >
					<header className="App-header">
						<p>
							In this wizard we will setup step by step process for Assignment submission.
						</p>
						<ul>
							<li>Student will login to their account.</li>
							<li>Click on assignment plugin icon.</li>
							<li>Student will select assignment.</li>
							<li>Student will download the assignment.</li>
							<li>Student will be able to submit assigment</li>
						</ul>
						<p>
							<button onClick={this.onClick}>Continue</button>
						</p>
					</header>
				</div>
			);
		}
	}
}
