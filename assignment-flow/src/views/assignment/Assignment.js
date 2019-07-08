import React from 'react';
import '../../style/assignment.css';
import 'react-table/react-table.css';
import ReactTable from 'react-table';
import Utils from './../../utils/Utils';
import { Redirect } from "react-router-dom";

export default class Assignment extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			selected: false,
			subject: 0,
			rows: [],
			cols: []
		};
		this.getCols = this.getCols.bind(this);
		this.setRows = this.setRows.bind(this);
		this.subChange = this.subChange.bind(this);
		this.selAsignment = this.selAsignment.bind(this);
	}

	setRows(key, sub, columns) {
		const lst = [];
		Utils.dataJson.assignments.map(asign => {
			if (parseInt(asign.subject) === sub) {
				const row = {};
				row.id = asign.id;
				row.year = asign.year;
				row.type = asign.type;
				row.marks = asign.marks;
				row.section = asign.section;
				row.teacher = asign.teacher;
				row.assignment = asign.assignment;
				const sb = Utils.getObjectById(Utils.dataJson.subjects, sub);
				const dep = Utils.getObjectById(Utils.dataJson.departments, sb.department);
				row.subject = sb.name;
				row.department = dep.name;
				console.log("Row: ", row);
				lst.push(row);
			}
			return asign;
		});
		console.log(key + ": " + sub);
		console.log("Rows: ", lst);
		console.log("Columns: ", columns);
		this.setState({
			[key]: sub,
			rows: lst,
			cols: columns
		});
	}

	getCols() {
		const clmn = [];
		Utils.dataJson.assignments.map(item => {
			Object.keys(item).map(k => {
				let key = Utils.getReactTableColObj(k, k);
				if (!Utils.arrayHasObject(clmn, key)) {
					clmn.push(key);
				}
				return k;
			});
			return item;
		});
		clmn.push({
			Header: 'Action',
			Cell: (props) => <button>Select It</button>
		});
		return clmn;
	}

	subChange(e) {
		const sub = parseInt(e.target.value);
		console.log("You had selected subject: " + sub);
		if (sub > 0) {
			this.setRows(e.target.name, sub, this.getCols());
		} else {
			this.setState({
				[e.target.name]: sub
			});
		}
	}

	selAsignment(state, rowInfo, column, instance, e) {
		if (column.Header === 'Action') {
			this.selAssign = Utils.getObjectById(
				Utils.dataJson.assignments, rowInfo.row.id);
			this.setState({
				selected: true
			});
		}
	}

	render() {
		if (this.state.selected) {
			console.log("Sel: ", this.selAssign)
			return (
				<Redirect push
					to={{
						pathname: "/wizard",
						assignment: this.selAssign
					}} 
				/>);
		} else {
			return (
				<div className="root">
					<div className="assignment">
						<p>Acadmic Year <b>{Utils.dataJson.acadamicYear}</b></p>
						<div>
							<p>
								Please select subject: &nbsp;
								<select name="subject" value={this.state.subject}
									onChange={this.subChange}>
									{Utils.dataJson.subjects.map((opt, ind) =>
										<option key={ind} value={opt.id}>{opt.name}</option>)}
								</select>
							</p>
						</div>
					</div>
					<ReactTable style={{ margin: '5px' }}
						data={this.state.rows} columns={this.state.cols} minRows="0"
						getTdProps={(state, rowInfo, column, instance) => {
							return {
								// style: {
								// 	background: '#DDDDDD'
								// },
								onClick: (e, handleOriginal) => {
									this.selAsignment(state, rowInfo, column, instance, e);
									
									// IMPORTANT! React-Table uses onClick internally to trigger
									// events like expanding SubComponents and pivots.
									// By default a custom 'onClick' handler will override this functionality.
									// If you want to fire the original onClick handler, call the
									// 'handleOriginal' function.
									if (handleOriginal) {
										handleOriginal()
									}
								}
							}
						}} />
				</div>
			);
		}
	}
}
