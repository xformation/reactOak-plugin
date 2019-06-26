import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Utils from './../../../utils/Utils.js'

export default class SyncTable extends React.Component {

	data = [
		{
			"id": 1,
			"code": "Synk-000001",
			"name": "Rajesh Kumar Upadhyay",
			"address": {
				"plot": "163/156",
				"street": "Kumbha Marg",
				"locality": "Sec-16, Pratap Nagar Sanganer",
				"landmark": "RHB",
				"city": "Jaipur",
				"district": "Jaipur",
				"state": "Rajasthan",
				"country": "India",
				"zip": "302033"
			},
			"designation": "Manager",
			"level": "MM-1",
			"gardian": "Ramesh Chand Sharma",
			"dob": "23-05-1981 00:00:00",
			"joining_at": "01-01-2009",
			"bd": "01-01-2009",
			"age": 37,
			"salary": 10000,
			"mobile": "9414795988",
			"education": ["B.Sc.", "PGDCA", "M.Sc.", "MCA"]
		},
		{
			"id": 2,
			"code": "Synk-000002",
			"name": "Anju Sharma",
			"address": {
				"plot": "163/156",
				"street": "Kumbha Marg",
				"locality": "Sec-16, Pratap Nagar Sanganer",
				"landmark": "RHB",
				"city": "Jaipur",
				"district": "Jaipur",
				"state": "Rajasthan",
				"country": "India",
				"zip": "302033"
			},
			"designation": "Developer",
			"level": "SSE-L1",
			"gardian": "Rajesh Kumar Upadhyay",
			"dob": "26-08-1980 00:00:00",
			"joining_at": "01-01-2013",
			"bd": "01-09-2015",
			"age": 38,
			"salary": 20000,
			"mobile": "9414795988",
			"education": ["B.A.", "PGDCA", "M.A."]
		}
	];
	// constructor(props) {
	// 	super(props);
	// }
	render() {
		var entKeys = [];
		this.data.forEach( (item, index) => {
			console.log("----Index: " + index);
			entKeys = Utils.visitEntityForKeys(entKeys, item, true, true);
		});
		console.log("Keys: ", entKeys);
		return (<ReactTable data={this.data} columns={entKeys} minRows="0"
			getTrProps={(state, rowInfo, column, instance) => {
				return {
					onClick: (e, handleOriginal) => {
						console.log('A Td Element was clicked!')
						console.log('it produced this event:', e)
						console.log('It was in this column:', column)
						console.log('It was in this row:', rowInfo)
						console.log('It was in this table instance:', instance)

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
			}
		} />);
	}
}
