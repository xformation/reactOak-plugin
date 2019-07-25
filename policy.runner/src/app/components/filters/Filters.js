import React from 'react';
import './Filters.css';

const filterTypes = {
	TEXT: 'TEXT',
	RANGE_SLIDER: 'RANGE_SLIDER',
	RANGE_TEXT: 'RANGE_TEXT',
	RATING: 'RATING',
	IMAGE: 'IMAGE',
	CHK_LIST: 'CHK_LIST',
	OPT_LIST: 'OPT_LIST'
};

export default class Filters extends React.Component {

	static INPUTJSON = {
		//baseUrl: 'http://localhost:3000',
		sortby: [
			{
				title: 'Favorite',
				value: 'fav'
			}, {
				title: 'New Arrive',
				value: 'new'
			}, {
				title: 'Price Low to High',
				value: 'lowFirst'
			}, {
				title: 'Price High to Low',
				value: 'highFirst'
			}
		],
		elements: [
			{
				title: 'Name',
				type: filterTypes.TEXT,
				key: 'name'
			}, {
				title: 'Max Price',
				type: filterTypes.RANGE_SLIDER,
				key: 'maxprice',
				step: '1.0',
				min: 0,
				max: 65536,
				ticks: true
			}, {
				title: 'Price',
				type: filterTypes.RANGE_TEXT,
				key: 'price',
				min: 0,
				max: 65536
			}, {
				title: 'Rating',
				type: filterTypes.RATING,
				key: 'rating',
				min: 0,
				max: 5
			}, {
				title: 'Icons',
				type: filterTypes.IMAGE,
				key: 'icons',
				choices: [
					{url: 'https://img.icons8.com/nolan/2x/add-image.png', value: 1},
					{url: 'https://img.icons8.com/dotty/2x/full-image.png', value: 2},
					{url: 'https://img.icons8.com/ios/2x/erase-image.png', value: 3}
				]
			}, {
				title: 'Brands',
				type: filterTypes.CHK_LIST,
				key: 'brands',
				choices: [
					'Nike', 'Addidas', 'Levis'
				]
			}, {
				title: 'RAM',
				type: filterTypes.OPT_LIST,
				key: 'ram',
				choices: [
					'1GB', '2GB', '4GB', '8GB', '16GB', '32GB'
				]
			}
		]
	}

	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			filters: {}
		};
		this.createRating = this.createRating.bind(this);
		this.createSortBy = this.createSortBy.bind(this);
		this.getFilterRow = this.getFilterRow.bind(this);
		this.createFilters = this.createFilters.bind(this);
		this.createOPTFilter = this.createOPTFilter.bind(this);
		this.createCHKFilter = this.createCHKFilter.bind(this);
		this.createFilterItem = this.createFilterItem.bind(this);
		this.createTextFilter = this.createTextFilter.bind(this);
		this.createImageFilter = this.createImageFilter.bind(this);
		this.createRngSldFilter = this.createRngSldFilter.bind(this);
		this.createRngTxtFilter = this.createRngTxtFilter.bind(this);
		this.createRatingFilter = this.createRatingFilter.bind(this);

		this.txtBlur = this.txtBlur.bind(this);
		this.selectImg = this.selectImg.bind(this);
		this.keyPressed = this.keyPressed.bind(this);
		this.reloadPage = this.reloadPage.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	componentWillMount() {
		const url = window.location.href;
		if (url.indexOf("?") > 0) {
			this.baseUrl = url.substring(0, url.indexOf("?"));
		} else {
			this.baseUrl = url;
		}
		const filters = Filters.getParamFilters(url);
		this.setState({
			filters: filters
		});
	}

	static getParamFilters(url) {
		const filters = {};
		if (url.indexOf("?") > 0) {
			const params = url.substring(url.indexOf("?") + 1);
			const arr = params.split('&');
			arr.map((kv, i) => {
				if (kv.indexOf('=') > 0) {
					const key = kv.substring(0, kv.indexOf('='));
					const val = kv.substring(kv.indexOf('=') + 1);
					if (val.indexOf('-') > 0) {
						filters[key + "_Min"] = val.substring(0, val.indexOf('-'));
						filters[key + "_Max"] = val.substring(val.indexOf('-') + 1);
					}
					filters[key] = val;
				}
				return kv;
			});
		}
		return filters;
	}

	handleChange(e) {
		const tgt = e.target ? e.target : e.currentTarget;
		const evtp = e.target.type;
		const key = tgt.id;
		const filters = this.state.filters;
		if (evtp === 'checkbox') {
			filters[key] = (filters[key] ? filters[key] + ',' : '') + tgt.value;
		} else {
			filters[key] = tgt.value;
		}
		if (key.indexOf("_Min") > 0) {
			const rkey = key.substring(0, key.indexOf("_Min"));
			if (!filters[rkey + "_Max"]) {
				filters[rkey + "_Max"] = tgt.placeholder;
			}
			filters[rkey] = tgt.value + "-" + filters[rkey + "_Max"];
		} else if (key.indexOf("_Max") > 0) {
			const rkey = key.substring(0, key.indexOf("_Max"));
			if (!filters[rkey + "_Min"]) {
				filters[rkey + "_Min"] = tgt.placeholder;
			}
			filters[rkey] = filters[rkey + "_Min"] + "-" + tgt.value;
		}
		this.setState({
			filters: filters
		});
		if (evtp !== 'text') {
			this.reloadPage();
		}
	}

	txtBlur(e) {
		let val = e.target.value;
		if (val && val.trim() !== "" && val.trim().length > 0) {
			this.reloadPage();
		}
	}

	keyPressed(e) {
		if (e.key === 'Enter') {
			this.txtBlur(e);
		}
	}

	reloadPage() {
		let params = '';
		if (this.state.filters) {
			Object.entries(this.state.filters).map(([key, val], indx) => {
				if (params.length > 0) {
					params += '&';
				}
				if (key.indexOf('_') === -1) {
					params += key + "=" + val;
				}
				return indx;
			});
			setTimeout(() => {
				window.location.href = this.baseUrl + "?" + params;
			}, 1000);
		}
	}

	selectImg(e) {
		const id = e.target.id;
		if (id && id.indexOf("_") > 0) {
			const key = id.substring(0, id.indexOf("_"));
			const val = id.substring(id.indexOf("_") + 1);
			const filters = this.state.filters;
			filters[key] = val;
			this.setState({
				filters: filters
			});
			this.reloadPage();
		}
	}

	componentDidMount() {
		this.setState({
			isLoading: false
		});
	}

	render() {
		if (this.state.isLoading) {
			return (
				<div className="divLoader">
					<img src="/images/loader.gif" alt="Loader" />
				</div>
			);
		} else {
			return (
				<div className="fltrDiv">
					<table key='tbl-fltrFrm'>
						<tbody key='tbd-fltrFrm'>
							{this.createSortBy()}
							{this.createFilters()}
						</tbody>
					</table>
				</div>
			);
		}
	}

	createFilters() {
		const rows = [];
		if (this.props && this.props.json.elements) {
			const eles = this.props.json.elements;
			eles.map((ele, indx) => {
				rows.push(this.getFilterRow(ele, indx));
				return ele;
			});
		}
		return rows;
	}

	getFilterRow(ele, indx) {
		return (
			<tr key={"tr-fltrFrm-" + indx}>
				<td key={"tdt-fltrFrm-" + indx} className="fltrTitle">
					<label className="title" key={"lblTtl-fltrFrm" + indx}>{ele.title}</label>
					{this.createFilterItem(ele)}
				</td>
			</tr>
		);
	}

	createFilterItem(ele) {
		switch (ele.type) {
			case filterTypes.TEXT:
				return this.createTextFilter(ele);
			case filterTypes.RANGE_SLIDER:
				return this.createRngSldFilter(ele);
			case filterTypes.RANGE_TEXT:
				return this.createRngTxtFilter(ele);
			case filterTypes.RATING:
				return this.createRatingFilter(ele);
			case filterTypes.IMAGE:
				return this.createImageFilter(ele);
			case filterTypes.CHK_LIST:
				return this.createCHKFilter(ele);
			case filterTypes.OPT_LIST:
				return this.createOPTFilter(ele);
			default:
				console.log('Unsupport filter type: ' + ele.type);
				break;
		}
	}

	createOPTFilter(ele) {
		const opts = [];
		if (ele.choices) {
			ele.choices.map((item, indx) => {
				opts.push(
					<div key={'divrd' + ele.key + indx}>
						<input type="radio" key={'rd' + ele.key + indx} value={item}
							id={ele.key} onChange={this.handleChange} group={ele.key}
							checked={this.state.filters[ele.key] === String(item)}/>
						<label htmlFor={ele.key}>{item}</label>
					</div>
				);
				return item;
			});
		}
		return (
			<div>{opts}</div>
		);
	}

	createCHKFilter(ele) {
		const chks = [];
		const vals = [];
		if (this.state.filters[ele.key]) {
			const val = this.state.filters[ele.key];
			if (val.indexOf(',') > 0) {
				val.split(',').map(item => vals.push(item));
			} else {
				vals.push(val);
			}
		}
		if (ele.choices) {
			ele.choices.map((item, indx) => {
				chks.push(
					<div key={'divchk' + ele.key + indx}>
						<input type="checkbox" key={'chk' + ele.key + indx}
							id={ele.key} onChange={this.handleChange}
							defaultChecked={vals.indexOf(String(item)) >= 0} value={item}/>
						<label htmlFor={ele.key}>{item}</label>
					</div>
				);
				return item;
			});
		}
		return (
			<div>{chks}</div>
		);
	}

	createImageFilter(ele) {
		const imgs = [];
		if (ele.choices) {
			const sel = this.state.filters[ele.key] ? this.state.filters[ele.key] : -1;
			const props = {};
			ele.choices.map((item, indx) => {
				if (sel !== -1 && String(item.value) === sel) {
					props.className = "selImg";
				} else {
					props.className = "imgTag";
				}
				imgs.push(<img alt="Icon" height="60px" width="60px"
					onClick={this.selectImg} src={item.url}
					key={ele.key + indx} id={ele.key + "_" + item.value} {...props}/>);
				return item;
			});
		}
		return (
			<div>
				{imgs}
			</div>
		);
	}

	createRatingFilter(ele) {
		const ratings = [];
		for (let ind = ele.min; ind <= ele.max; ind++) {
			ratings.push(this.createRating(ind, ele.max, ele.key));
		}
		return ratings;
	}

	createRating(indx, max, group) {
		return (
			<div className="ratingDiv" key={'dv' + group + indx}>
				<input type="radio" key={'rd' + group + indx}
					id={group} onChange={this.handleChange}
					checked={this.state.filters[group] === String(indx)} value={indx}/>
				{this.getImages(group, 0, indx, "/images/fillStar1.png")}
				{this.getImages(group, indx, max, "/images/emptyStar1.png")}
			</div>
		);
	}

	getImages(group, indx, max, path) {
		const arr = [];
		for (let i = indx; i < max; i ++) {
			arr.push(<img key={'img' + group + indx + i} src={path} alt="Star"/>);
		}
		return arr;
	}

	static listLabels(min, max) {
		const diff = (max - min);
		const inc = parseInt( diff / 10);
		const opts = [];
		let val = 0;
		for (let i = 0; i <= 10; i++) {
			const props = {
				key: 'dtl' + i
			};
			switch(i) {
				case 0:
					val = min;
					props.label = val;
					break;
				case 5:
						val = parseInt(diff / 2);
						props.className = "lmargin20";
						props.label = val;
					break;
				case 10:
						val = max;
						props.label = val;
					break;
				default:
					val += inc;
					break;
			}
			props.value = val;
			opts.push(<option {...props}/>);
		}
		return opts;
	}

	createRngSldFilter(ele) {
		return (
			<div className="rangeDiv">
				{ele.ticks && <datalist id={ele.key + "_ticks"} key={ele.key + "_ticks"}>
					{Filters.listLabels(ele.min, ele.max)}
				</datalist>}
				<input type="range" name={ele.key} id={ele.key} min={ele.min} max={ele.max}
					onInput={this.handleChange} onChange={this.handleChange} step={ele.step ? ele.step : 1}
					value={this.state.filters[ele.key] ? this.state.filters[ele.key] : ele.max}
					list={ele.key + "_ticks"} />
				<output htmlFor={ele.key}>{this.state.filters[ele.key] ? this.state.filters[ele.key] : ele.max}</output>
			</div>
		);
	}

	createRngTxtFilter(ele) {
		const mnKey = ele.key + "_Min";
		const mxKey = ele.key + "_Max";
		return (
			<div className="rangeDiv">
				<div className="rangeInputDiv">
					<input type="text" id={mnKey} placeholder={ele.max} size="10"
						value={this.state.filters[mnKey] ? this.state.filters[mnKey] : ele.min}
						onChange={this.handleChange} onBlur={this.txtBlur} onKeyPress={this.keyPressed}/>
					To
					<input type="text" id={mxKey} placeholder={ele.min} size="10"
						value={this.state.filters[mxKey] ? this.state.filters[mxKey] : ele.max}
						onChange={this.handleChange} onBlur={this.txtBlur} onKeyPress={this.keyPressed}/>
				</div>
			</div>
		);
	}

	createTextFilter(ele) {
		return (
			<div>
				<input type="text" id={ele.key} onChange={this.handleChange} onBlur={this.txtBlur}
					value={this.state.filters[ele.key] ? this.state.filters[ele.key] : ""}
					onKeyPress={this.keyPressed}/>
			</div>
		);
	}

	createSortBy() {
		if (this.props && this.props.json.sortby) {
			const sort = this.props.json.sortby;
			return (
				<tr key={'hdr-fltrFrm'}>
					<td key={'hdr-td-fltrFrm'}>
						<label className="title" key="lblSrt-fltrFrm">Sort</label>
						<div>
							<select id="sortby" onChange={this.handleChange} value={this.state.filters.sortby}>
								<option key="defSel">--Select--</option>
								{
									sort.map(item => (
										<option key={item.value} value={item.value}>
											{item.title}
										</option>
									))
								}
							</select>
						</div>
					</td>
				</tr>
			);
		}
	}
}
