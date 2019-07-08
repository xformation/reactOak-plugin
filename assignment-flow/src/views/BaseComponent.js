import React from 'react';

export default class BaseComponent extends React.Component {

	constructor(props) {
		super(props);

		this.putItem = this.putItem.bind(this);
		this.getItem = this.getItem.bind(this);
	}

	putItem(key, value) {
		let val = '';
		if (typeof value !== 'string') {
			switch(typeof value) {
				case 'bigint':
				case 'boolean':
				case 'number':
					val = String(value);
					break;
				default:
					val = JSON.stringify(value);
					break;
			}
		} else {
			val = value;
		}
		localStorage.setItem(key, val);
	}

	getItem(key, type = 'string') {
		const value = localStorage.getItem(key);
		switch (type) {
			case 'bigint':
				return parseInt(value);
			case 'boolean':
				return value.toLowerCase() === 'true' ? true : false;
			case 'number':
				return parseFloat(value);
			case 'string':
				return value;
			default:
				return JSON.parse(value);
		}
	}
}
