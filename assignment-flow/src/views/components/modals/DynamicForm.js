import React from 'react';
import './dynaForm.css';
import BaseComponent from '../../BaseComponent';

/**
 * Component to create Dynamic Form in reactjs.
 * 
 * Uses:
 * 
 * import DynamicForm from './../components/modals/DynamicForm';
 * 
 * <DynamicForm json={DynamicForm.dynaFormInput}
 * 	submitText='Save'
 * 	onSubmit={this.handleFinish}/>
 * 
 * you can define actions for your controls by using properties naming convesion:
 * 
 * '<control-name>onClick' for clickable elements like buttons
 * 
 * '<control-name>onChange' for handing change events of elements like text, radio or checkbox
 * 
 * i.e.
 * 
 * <DynamicForm json={DynamicForm.dynaFormInput}
 * 	submitText='Save'
 * 	onSubmit={this.handleFinish}
 * 	downloadOnClick={this.downloadFile}
 * 	tmpTextOnChange={this.handleTextchange}/>
 * 
 * You will get 2 params in handler methods first is 'Event' and
 * Second is current filled values in form.
 * 
 * On finishing form input you can get the filled values
 * from default complete button handler
 * 
 */
export default class DynamicForm extends BaseComponent {

	static ActionTypes = {
		CHANGE: 'OnChange',
		CLICK: 'OnClick'
	}

	static ControlTypes = {
		BUTTON: 'BUTTON',
		CHECKBOX: 'CHECK',
		LABEL: 'LABEL',
		RADIO: 'RADIO',
		TEXT: 'TEXT'
	};

	static dynaFormInput = {
		title: 'Dyanmic Form',
		controls: [
			{
				type: DynamicForm.ControlTypes.LABEL,
				name: 'lablInfo',
				text: 'Download the Assignment'
			}, {
				type: DynamicForm.ControlTypes.BUTTON,
				name: 'download',
				text: 'Download...',
				hasaction: true
			}, {
				type: DynamicForm.ControlTypes.CHECKBOX,
				name: "checked",
				text: 'I had downloaded the assignments, successfully.',
				isRequired: true
			}, {
				type: DynamicForm.ControlTypes.TEXT,
				name: 'tmpText',
				text: 'Enter your name',
				size: 40,
				isRequired: true,
				hasaction: true
			}, {
				type: DynamicForm.ControlTypes.RADIO,
				name: 'option',
				text: 'Select an option',
				choices: [
					{'key': 1, 'value': 'A'},
					{'key': 2, 'value': 'B'},
					{'key': 3, 'value': 'C'},
					{'key': 4, 'value': 'D'}
				]
			}
		]
	};

	static getTragetHanler(props, name, actType) {
		console.log(name, actType, props);
		if (props) {
			console.log('Searching for handler property named: ' + name + actType);
			return props[name + actType];
		}
		return null;
	}

	static getElesToValidate(json) {
		const arr = [];
		json.controls.forEach(ele => {
			if (ele.isRequired) {
				arr.push(ele.name);
			}
		});
		return arr;
	}

	/**
	 * All controls onChange event handler, it passon event to caller,
	 * if we had defined a handler property with control name in properties.
	 * @param {Event} e 
	 */
	changeHandler(e) {
		const key = e.target.name;
		const inputs = this.state.inputs;
		if (e.target.type === 'checkbox') {
			inputs[key] = e.target.checked;
		} else {
			inputs[key] = e.target.value;
		}
		if (e.target.getAttribute('hasaction') === 'true') {
			const handler = DynamicForm.getTragetHanler(
				this.state.userProps, key, DynamicForm.ActionTypes.CHANGE);
			if (handler && typeof handler === 'function') {
				handler(e, this.state.inputs);
			}
		}
		this.setState({
			inputs: inputs
		});
	}

	/**
	 * All controls onChange event handler, it passon event to caller,
	 * if we had defined a handler property with control name in properties.
	 * @param {Event} e 
	 */
	actionHandler(e) {
		if (e.target.getAttribute('hasaction') === 'true') {
			const handler = DynamicForm.getTragetHanler(
				this.state.userProps, e.target.name, DynamicForm.ActionTypes.CLICK);
			if (handler && typeof handler === 'function') {
				handler(e, this.state.inputs);
			}
		} else {
			console.warn("You have not defined any action handler for " + e.target.name + ".");
		}
	}

	isFinished() {
		const myProps = this.state.userProps;
		let finished = false;
		const errs = [];
		if (myProps && myProps.json) {
			const eleToValidate = DynamicForm.getElesToValidate(myProps.json);
			if (eleToValidate && eleToValidate.length > 0) {
				eleToValidate.forEach(key => {
					if (!this.state.inputs[key]) {
						errs.push(key + " is Required.");
					}
				});
				finished = true;
			}
			if (errs.length > 0) {
				this.setState({
					errors: errs
				});
			}
		}
		return finished;
	}

	handleFinish() {
		if (!this.isFinished()) {
			return;
		}
		console.log('Result: ', this.state.inputs);
		const myProps = this.state.userProps;
		if (myProps && myProps.onSubmit) {
			myProps.onSubmit(this.state.inputs);
		} else {
			console.warn('No submit handler defined.');
		}
	}

	constructor(props) {
		super(props);

		this.state = {
			userProps: this.props,
			inputs: {}
		};

		this.changeHandler = this.changeHandler.bind(this);
		this.actionHandler = this.actionHandler.bind(this);

		this.getRadio = this.getRadio.bind(this);
		this.createRow = this.createRow.bind(this);
		this.createLabel = this.createLabel.bind(this);
		this.createRadio = this.createRadio.bind(this);
		this.createButton = this.createButton.bind(this);
		this.createTextbox = this.createTextbox.bind(this);
		this.createCheckbox = this.createCheckbox.bind(this);

		this.isFinished = this.isFinished.bind(this);
		this.getErrItems = this.getErrItems.bind(this);
		this.handleFinish = this.handleFinish.bind(this);
		this.createFooter = this.createFooter.bind(this);
		this.createViewRows = this.createViewRows.bind(this);
		this.createHeaderRow = this.createHeaderRow.bind(this);
	}

	render() {
		return (
			<div key='div-dynamicForm' className="dynamicForm">
				<table key='tbl-dynFrm'>
					<thead key='thd-dynFrm'>
						{this.createHeaderRow()}
					</thead>
					<tbody key='tbd-dynFrm'>
						{this.createViewRows()}
					</tbody>
					<tfoot key='tf-dynFrm'>
						{this.createFooter()}
					</tfoot>
				</table>
			</div>
		);
	}

	getErrItems() {
		const items = [];
		this.state.errors.forEach((err, indx) => {
			items.push(<li key={'err-' + indx}>{err}</li>);
		})
		return items;
	}

	createViewRows() {
		const cntrls = [];
		const myProps = this.state.userProps;
		if (myProps && myProps.json && myProps.json.controls) {
			myProps.json.controls.forEach((element, indx) => {
				switch(element.type) {
					case DynamicForm.ControlTypes.BUTTON:
						cntrls.push(this.createRow(
							this.createButton(element), indx));
						break;
					case DynamicForm.ControlTypes.CHECKBOX:
						cntrls.push(this.createRow(
							this.createCheckbox(element), indx));
						break;
					case DynamicForm.ControlTypes.LABEL:
						cntrls.push(this.createRow(
							this.createLabel(element), indx));
						break;
					case DynamicForm.ControlTypes.RADIO:
						cntrls.push(this.createRow(
							this.createRadio(element), indx));
						break;
					case DynamicForm.ControlTypes.TEXT:
						cntrls.push(this.createRow(
							this.createTextbox(element), indx));
						break;
					default:
						console.error("Unknown control type in ", element);
						break;
				}
			});
		}
		return cntrls;
	}

	createRow(htmlEle, indx) {
		return (
			<tr key={"tr-dynFrm-" + indx}>
				<td key={"td-dynFrm-" + indx}>
					{htmlEle}
				</td>
			</tr>
		);
	}

	/**
	 * Method to render a react textbox from input json with props:
	 * @requires type: DynamicForm.ControlTypes.TEXT,
	 * @requires text: 'Select me',
	 * @otherProps isRequired: true,
	 * @otherProps name: 'chk',
	 * @otherProps hasaction: true
	 * @param {JSON} ele 
	 */
	createTextbox(ele) {
		if (ele && ele.type === DynamicForm.ControlTypes.TEXT) {
			const prop = {};
			if (ele.name) {
				prop.id = ele.name;
				prop.name = ele.name;
				prop.placeholder = ele.text;
			}
			if (ele.hasaction) {
				prop.hasaction = 'true';
			}
			if (ele.size) {
				prop.size = ele.size;
			}
			return (
				<input key={'txt-dynFrm' + ele.name} type="text"
					onChange={this.changeHandler}
					value={this.state.inputs[prop.name] || ''}
					{...prop}/>
			);
		}
	}

	/**
	 * Method to render a react radio group from input json with props:
	 * @requires type: DynamicForm.ControlTypes.RADIO,
	 * @requires name: 'Select one',
	 * @otherProps isRequired: true,
	 * @otherProps choices: [{'key': 1, 'value': 'A'}],
	 * @otherProps hasaction: true
	 * @param {JSON} ele 
	 */
	createRadio(ele) {
		if (ele && ele.type === DynamicForm.ControlTypes.RADIO) {
			const prop = {};
			if (ele.name) {
				prop.name = ele.name;
			}
			if (ele.hasaction) {
				prop.hasaction = 'true';
			}
			const radios = [];
			ele.choices.forEach((choice, indx) => {
				prop.id = ele.name + indx;
				radios.push(this.getRadio(prop, choice));
			});
			return radios;
		}
	}

	getRadio(prop, choice) {
		const ukey = "rd-dynFrm_" + choice.key;
		return ([
			<input type="radio" key={ukey}
				value={choice.key}
				onChange={this.changeHandler}
				checked={this.state.inputs[prop.name] === String(choice.key)}
				{...prop}/>,
			<label key={ukey + "for"}>
				{choice.value}
			</label>
		]);
	}

	/**
	 * Method to render a react label from input json with props:
	 * @requires type: DynamicForm.ControlTypes.LABEL,
	 * @requires name: 'lblInfo',
	 * @requires text: 'Download the Assignment',
	 * @param {JSON} ele 
	 */
	createLabel(ele) {
		if (ele && ele.type === DynamicForm.ControlTypes.LABEL) {
			return (
				<label key={'lbl-dynFrm' + ele.name}>{ele.text}</label>
			);
		}
	}

	/**
	 * Method to render a react checkbox from input json with props:
	 * @requires type: DynamicForm.ControlTypes.CHECKBOX,
	 * @requires text: 'Select me',
	 * @otherProps isRequired: true,
	 * @otherProps name: 'chk',
	 * @otherProps hasaction: true
	 * @param {JSON} ele 
	 */
	createCheckbox(ele) {
		if (ele && ele.type === DynamicForm.ControlTypes.CHECKBOX) {
			const prop = {};
			if (ele.name) {
				prop.id = ele.name;
				prop.name = ele.name;
			}
			if (ele.hasaction) {
				prop.hasaction = 'true';
			}
			return ([
				<input type="checkbox" key={'chk-dynFrm-' + prop.id}
					onChange={this.changeHandler}
					defaultChecked={this.state.inputs[ele.name]}
					{...prop} value={this.state.inputs[prop.name]}/>,
				<label key={'chk-dynFrm-' + prop.id + "for"}>{ele.text}</label>
			]);
		}
	}

	/**
	 * Method to render a react button from input json with props:
	 * @requires type: DynamicForm.ControlTypes.BUTTON,
	 * @requires text: 'Download...',
	 * @requires name: 'download',
	 * @otherProps hasaction: true
	 * @param {JSON} ele 
	 */
	createButton(ele) {
		if (ele && ele.type === DynamicForm.ControlTypes.BUTTON) {
			const prop = {
				id: ele.name,
				name: ele.name
			};
			if (ele.hasaction) {
				prop.hasaction = 'true';
			}
			return (
				<button key={'btn-dynFrm-' + prop.id} {...prop} onClick={this.actionHandler}>
					{ele.text}
				</button>
			);
		}
	}

	createHeaderRow() {
		const myProps = this.state.userProps;
		if (myProps && myProps.json && myProps.json.title) {
			const span = {};
			if (myProps.cols) {
				span.colSpan = myProps.cols
			}
			return (
				<tr key={'hdr-dyFrm'} className="headerRow">
					<td key={'hdr-td-dyFrm'} {...span}>
						{myProps.json.title}
					</td>
				</tr>
			);
		}
	}

	createFooter() {
		const myProps = this.state.userProps;
		if (myProps) {
			const txt = myProps.submitText ? myProps.submitText : 'Submit';
			const span = {};
			if (myProps.cols) {
				span.colSpan = myProps.cols
			}
			return (
				<tr key={'fte-dyFrm'} className="headerRow">
					<td key={'ftr-td-dyFrm'} {...span}>
						<button key={'btn-smt-dyFrm-' + txt} onClick={this.handleFinish}>{txt}</button>
						{
							this.state.errors &&
							<div key={'dv-ftr-dyFrm'} className="errorMsg">
								<ul key={'ul-dv-ftr-dyfrm'}>
									{this.getErrItems()}
								</ul>
							</div>
						}
					</td>
				</tr>
			);
		}
	}
}
