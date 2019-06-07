import React from 'react';
import './../../../css/index.css';
import Utils from './../../../utils/Utils.js';

export default class Rules extends React.Component {

	constructor(props, context) {
		super(props, context);

		this.index = 0;

		this.state = {
			name: '',
			entity: '',
			description: '',
			inputs: [{
				id: ++this.index,
				text: ''
			}],
			show: false,
			res: ''
		};

		this.addMore = this.addMore.bind(this);
		this.addInput = this.addInput.bind(this);
		this.txtChange = this.txtChange.bind(this);
		this.inputChange = this.inputChange.bind(this);
		this.saveRule = this.saveRule.bind(this);
	}

	addMore() {
		const arr = this.state.inputs;
		arr.push({
			id: ++this.index,
			text: ''
		});
		this.setState({
			inputs: arr
		});
	}

	saveRule() {
		const arr = [];
		this.state.inputs.map(item => {
			if (item.text && item.text !== '') {
				arr.push(item.text);
			}
			return item;
		});
		const data = {
			name: this.state.name,
			entity: this.state.entity,
			description: this.state.description,
			checks: arr
		};
		console.log("data: ", data);
		Utils.postReq(process.env.REACT_APP_POLICY_RUNNER + '/rule/create', data,
			(response, err) => {
				if (err) {
					this.setState({
						res: 'Failed to create Rule, reason is: ' + err
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

	inputChange(e) {
		var id = e.target.id;
		var val = e.target.value;
		this.setState({
			[id]: val
		});
	}

	txtChange(e) {
		var id = e.target.id;
		var val = e.target.value;
		const chk = [];
		this.state.inputs.map((item) => {
			const ent = item;
			if (ent.id === parseInt(id)) {
				ent.text = val;
			}
			chk.push(ent);
			return ent;
		});
		this.setState({
			inputs: chk
		});
	}

	addInput() {
		const chks = this.state.inputs.map((item) => (
			<input key={item.id} id={item.id} size="80"
				onChange={this.txtChange} value={item.text} />
		));
		return chks;
	}

	render() {
		return (
			<table style={{ width: '80%', textAlign: 'left', marginLeft: '30px' }}>
				<caption style={{ textAlign: "center", captionSide: "top" }}>Create New Rule</caption>
				<tbody>
					<tr>
						<td>
							<label htmlFor="name">Name:<b>*</b></label>
						</td>
						<td>
							<input id="name" type="text"
								onChange={this.inputChange} value={this.state.name} />
						</td>
					</tr>
					<tr>
						<td>
							<label htmlFor="entity">Entity:<b>*</b></label>
						</td>
						<td>
							<input id="entity" type="text"
								onChange={this.inputChange} value={this.state.entity} />
						</td>
					</tr>
					<tr>
						<td>
							<label htmlFor="description">Description:</label>
						</td>
						<td>
							<input id="description" type="text"
								onChange={this.inputChange} value={this.state.description} />
						</td>
					</tr>
					<tr>
						<td>
							<label>Checks:<b>*</b></label>
						</td>
						<td>
							{this.addInput()}
							<button onClick={this.addMore}>Add More...</button>
						</td>
					</tr>
					<tr>
						<td colSpan="2">
							&nbsp;
						</td>
					</tr>
					<tr>
						<td colSpan="2">
							<button onClick={this.saveRule}>Save</button>
						</td>
					</tr>
					<tr>
						<td colSpan="2">
							&nbsp;
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
