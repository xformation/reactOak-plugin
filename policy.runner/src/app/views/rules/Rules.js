import React from 'react';
import './../../../css/index.css'

export default class Rules extends React.Component {

	constructor(props, context) {
		super(props, context);

		this.index = 0;

		this.state = {
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
		console.log("Checks: ", this.state.inputs);
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
			<input key={ item.id } id={ item.id }
				onChange={ this.txtChange } value={ item.text }/>
		));
		return chks;
	}

	render() {
		return (
			<table>
				<caption>Create New Rule</caption>
				<tbody>
					<tr>
						<td>
							<label htmlFor="name">Name:<b>*</b></label>
							<input id="name" type="text"></input>
						</td>
					</tr>
					<tr>
						<td>
							<label htmlFor="entity">Entity:<b>*</b></label>
							<input id="entity" type="text"></input>
						</td>
					</tr>
					<tr>
						<td>
							<label htmlFor="desc">Description:</label>
							<input id="desc" type="text"></input>
						</td>
					</tr>
					<tr>
						<td>
							<label>Checks:<b>*</b></label>
							{ this.addInput() }
							<button onClick={ this.addMore }>Add More...</button>
						</td>
					</tr>
					<tr>
						<td>
							<button onClick={ this.saveRule }>Save</button>
						</td>
					</tr>
					<tr>
						<td>
							&nbsp;
						</td>
					</tr>
					<tr>
						<td>
							<label>Response:</label>
							<pre className='maxHeight'>{this.state.elsQry}</pre>
						</td>
					</tr>
				</tbody>
			</table>
		);
	}

}
