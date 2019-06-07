import React from 'react';
import Utils from './../../utils/Utils.js';
import ViewBase from '../components/ViewBase.js';

export default class Executor extends ViewBase {

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
			+ "/policy/listAll?query=surveyjs").then((response) => {
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
					type: "dropdown",
					name: "policy",
					renderAs: "select2",
					choices: data,
					//choices: [{value: 1, text: "Policy 1"}, {value: 2, text: "Policy 2"}],
					// choicesByUrl: {
					// 	url: process.env.REACT_APP_POLICY_RUNNER + "/policy/listAll?query=surveyjs",
					//	valueName: 'value',
					//	displayValue: 'text'
					// },
					title: "Please select the policy to execute."
				}
			]
		};
	}

	onComplete(result) {
		console.log("Execute Policy: ", result.data);
		const val = result.data.policy;
		Utils.postReq(process.env.REACT_APP_POLICY_RUNNER + '/execute', "policyId=" + val,
			(response, err) => {
				if (err) {
					this.setState({
						elsQry: 'Request Failed with ' + err
					});
					return;
				} else {
					console.log("Res: ", response.data);
					var pretty = JSON.stringify(response.data, undefined, 4);
					this.setState({
						res: pretty
					});
				}
			});
	}

	render() {
		if (this.state.isLoading) {
			return (
				<div>
					<img alt="Loading..." src="./../../images/loader.gif"/>
				</div>
			);
		} else {
			return (
				<table style={{width: '80%', textAlign: 'left', marginLeft: '30px'}}>
					<caption style={{textAlign: "center", captionSide: "top"}}>Policy Executor</caption>
					<tbody>
						<tr>
							<td colSpan="2">
								{ super.getView('Execute') }
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
