import React from 'react';
import axios from 'axios';
import './../css/App.css';

export default class QueryPanel extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			qry: '',
			elsQry: '',
			suggestns: '',
			styleBg: 'whiteBG',
			styleSug: 'hideSuggesstionBox',
		};
		this.translate = this.translate.bind(this);
		this.suggestions = this.suggestions.bind(this);
		this.getQuery = this.getQuery.bind(this);
		this.postReq = this.postReq.bind(this);
		this.setSuggestions = this.setSuggestions.bind(this);
		this.selectSuggestion = this.selectSuggestion.bind(this);
	}

	suggestions(event) {
		const keyValue = event.key;
		console.log("pressed: ", keyValue);
		this.setState(({ qry }) => ({
				qry: qry + keyValue
			}));
		var val = this.getQuery(this.state.qry);
		if (val && (val === "" || val.length < 2)) {
			return;
		}
		this.setState({
			styleBg: 'loadingBG'
		});
		console.log(process.env);
		this.postReq(process.env.REACT_APP_POLICY_RUNNER + '/suggestKey', "query=" + val,
			(response) => {
				console.log("Res: ", response.data);
				this.setSuggestions(response.data);
			});
	}

	translate() {
		this.postReq(process.env.REACT_APP_POLICY_RUNNER + '/translate', JSON.stringify({
				"query": this.state.qry
			}), (response) => {
				var pretty = JSON.stringify(response.data, undefined, 4);
				console.log("Res: ", pretty);
				this.setState({
					elsQry: pretty
				});
			});
	}

	postReq(url, data, callback) {
		axios.post(
			url,
			data
		).then((response) => {
			callback(response);
		}).catch((error) => {
			console.log("Create Err: ", error);
		});
	}

	getQuery(val) {
		var res = val.trim();
		if (val && val.length > 0) {
			var arr = val.split(" ");
			if (arr) {
				var len = arr.length;
				if (len > 1) {
					var cur = arr[len - 1];
					var prev = arr[len - 2].toLowerCase();
					if (prev && prev.indexOf(",") === (prev.length - 1)) {
						for (var i = len - 2; i >= 0; i--) {
							var pVal = arr[i];
							if (pVal && pVal.indexOf("[") == 0) {
								res = cur;
								break;
							} else if (pVal.indexOf(",") === (pVal.length - 1)) {
								continue;
							} else {
								break;
							}
						}
					} else {
						switch (prev) {
							case 'has':
							case 'and':
							case 'or':
							case '[':
								res = cur;
								break;
							default:
								res = "";
						}
					}
				}
			}
		}
		if (res && res !== "" &&
			(res.indexOf("[") == 0 || res.indexOf("(") == 0)) {
			res = res.substring(1);
		}
		return res;
	}

	setSuggestions(data) {
		if (data && Array.isArray(data)) {
			var html = "<ul class='suggesstions'>";
			for (var i = 0; i < data.length; i++) {
				var key = data[i];
				html += "<li onclick=\"" + this.selectSuggestion(key) + "\">" + key + "</li>";
			}
			html += "</ul>";
			this.setState({
				suggestns: html,
				styleBg: 'whiteBG',
				styleSug: 'showSuggesstionBox'
			});
		}
	}

	selectSuggestion(val) {
		var prev = this.state.qry;
		var res = this.getQuery(prev);
		var sel = prev.replace(new RegExp(res + '$'), val);
		this.setState({
			qry: sel,
			styleBg: 'whiteBG'
		});
	}

	render() {
		const id = this.props.id || "qp";
		return (
			<div>
				<div>
					<label htmlFor={`${id}query`}>Query:</label>
					<input type="text" id={`${id}query`} defaultValue={this.state.qry}
						onKeyUp={this.suggestions} className={ this.state.styleBg }
						style={{ width: '100%' }} placeholder="Enter your query string..." />
					<div className="suggesstionBox" dangerouslySetInnerHTML={{__html: this.state.suggestns}}></div>
				</div>
				<div style={{textAlign: "center"}}>
					<input id="submit" type="button" value="Translate"
						onClick={this.translate} />
					<label>{this.state.elsQry}</label>
				</div>
			</div >
		);
	}
}
