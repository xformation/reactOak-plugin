import './Slider.css';
import React from 'react';
import Utils from './../../utils/Utils';

export default class Slider extends React.Component {

	constructor(props) {
		super(props);

		this.clickHandler = this.clickHandler.bind(this);
	}

	clickHandler(e) {
		const item = Utils.getObjectById(Utils.sliderData, parseInt(e.target.id));
		this.props.clickHandler(item);
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
								{
									this.props.data.map(item => {
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
											</td>
										);
									})
								}
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		);
	}

}
