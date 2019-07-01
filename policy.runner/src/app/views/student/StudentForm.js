import React from 'react';
import SidePanel from './SidePanel';
import SurveyMoel from './SurveyModal';

const PERSONAL = {
	title: "Personal Details",
	elements: [
		{
			type: "text",
			name: "name",
			title: "Enter Rule Name ...",
			isRequired: true,
			maxLength: 50,
			startWithNewLine: false
		},
		{
			type: "text",
			name: "entity",
			title: "Enter entity name to be search",
			isRequired: true,
			maxLength: 50,
			startWithNewLine: false
		}
	]
};
const ADDRESS = {
	title: "Address Details",
	elements: [
		{
			type: "text",
			name: "name",
			title: "Enter Rule Name ...",
			isRequired: true,
			maxLength: 50,
			startWithNewLine: false
		},
		{

			type: "multipletext",
			name: "checks",
			items: [
				{ name: "check1" }
			]
		},
		{
			type: "surveybutton",
			name: "addMore",
			buttonText: "Add More Checks...",
			startWithNewLine: false
		}
	]
};
const EDUCATION = {
	title: "Create New Rule",
	elements: [
		{

			type: "multipletext",
			name: "checks",
			items: [
				{ name: "check1" }
			]
		}
	]
};

export default class StudentForm extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			show: ''
		};

		this.toggle = this.toggle.bind(this);
	}

	toggle(e) {
		const id = e.target.id;
		this.setState({
			show: id
		});
	}

	render() {
		return (
			<table>
				<tbody>
					<tr>
						<td>
							<SidePanel />
						</td>
						<td>
							<div>
								<button id='personal' onClick={this.toggle}>Personal Details</button>
								{this.state.show === 'personal' &&
									<SurveyMoel id='personal' data={PERSONAL}
										clickHandler={this.clickHandler} />}
							</div>
							<div>
								<button id='address' onClick={this.toggle}>Student Address</button>
								{this.state.show === 'address' &&
									<SurveyMoel id='address' data={ADDRESS}
										clickHandler={this.clickHandler} />}
							</div>
							<div>
								<button id='education' onClick={this.toggle}>Student Education</button>
								{this.state.show === 'education' &&
									<SurveyMoel id='education' data={EDUCATION}
										clickHandler={this.clickHandler} />}
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		);
	}

}
