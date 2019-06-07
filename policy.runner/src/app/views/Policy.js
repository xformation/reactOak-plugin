import React from 'react';
import ViewBase from './../components/ViewBase.js';
import Utils from './../../utils/Utils.js';

export default class Policy extends ViewBase {

	constructor(props) {
		super(props);

		this.state = {
			res: '',
			isLoading: true
		};
		this.setData = this.setData.bind(this);
	}

	componentDidMount() {
		const self = this;
		Utils.getReq(process.env.REACT_APP_POLICY_RUNNER
			+ "/rule/listAll?query=surveyjs").then((response) => {
				console.log("res type: ", typeof response.data);
				var pretty = JSON.stringify(response.data, undefined, 4);
				console.log("Res: ", pretty);
				self.setData(response.data);
				self.setState({
					res: pretty,
					isLoading: false
				});
			});

		super.setJson(this.json);
	}

	setData(data) {
		this.json = {
			elements: [
				{
					type: "text",
					name: "name",
					title: "Enter Policy Name ...",
					isRequired: true,
					maxLength: 50,
					startWithNewLine: true
				},
				{
					type: "comment",
					name: "description",
					title: "Enter Policy desrption...",
				},
				{
					type: "tagbox",
					name: "rules",
					renderAs: "select2",
					//choices: [{value: 1, text: "item 1"}, {value: 2, text: "item 2"}],
					choices: data,
					//choicesByUrl: {
					// 	url: process.env.REACT_APP_POLICY_RUNNER + "/rule/listAll?query=surveyjs",
					//valueName: 'value',
					//displayValue: 'text'
					//},
					title: "Please select the rules for policy."
				}
			]
		};
	}

	onComplete(result) {
		console.log("data: ", result.data);
		Utils.postReq(process.env.REACT_APP_POLICY_RUNNER + '/policy/create', result.data,
			(response, err) => {
				if (err) {
					this.setState({
						res: 'Failed to create Policy, reason is: ' + err
					});
					return;
				} else {
					var pretty = JSON.stringify(response.data, undefined, 4);
					console.log("Res: ", pretty);
					this.setState({
						res: pretty
					});
				}
			});
	}

	render() {
		if (this.state.isLoading) {
			return (
				<div >
					<img alt="Loading..." src="./../../images/loader.gif"/>
				</div>
			);
		} else {
			return (
				<table style={{ width: '80%', textAlign: 'left', marginLeft: '30px' }}>
					<caption style={{ textAlign: "center", captionSide: "top" }}>Create New Policy</caption>
					<tbody>
						<tr>
							<td colSpan="2">
								{super.getView()}
							</td>
						</tr>
						<tr>
							<td colSpan="2">
								<label>Response:</label>
								<pre className='maxHeight'>{this.state.res}</pre>
							</td>
						</tr>
					</tbody>
				</table>
			);
		}
	}

}
