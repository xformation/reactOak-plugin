import './Slider.css';
import React from 'react';
import Utils from '../../../utils/Utils';

export default class Slider extends React.Component {

	constructor(props) {
		super(props);

		this.data = this.props.data;
		this.entity = this.props.entity;
		this.createCol = this.createCol.bind(this);
		this.clickHandler = this.clickHandler.bind(this);
	}

	createCol(item) {
		return (
			<td key={item.id}>
				{
					item.status === 'Y' ?
						<img className="iconImg" src="/images/tick.jpg" alt="Done"/> :
						<img className="iconImg" src="/images/cross.jpg" alt="Pending"/>
				} <br/>
				{item.text} <br/>
				<button id={item.id} onClick={this.clickHandler}
					disabled={!item.active}>Click Here</button>
			</td>);
	}

	clickHandler(e) {
		const item = Utils.getObjectById(this.data, parseInt(e.target.id));
		if (this.props.clickHandler) {
			this.props.clickHandler(item);
			return;
		}
	}

	render() {
		return (
			<div className="slider">
				<div className="sliderBg">
					<img src="/images/line.png" alt="Straight Line" style={{width: '98%'}}/>
				</div>
				<div className="ticks">
					<table>
						<tbody>
							<tr>
								{this.data.map(item => this.createCol(item))}
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		);
	}

}
