import React from 'react';
import Utils from './../utils/Utils';
import './QueryPanel.css';

export default class QueryPanel extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			qry: '',
			resTbl: '',
			elsQry: '',
			suggestns: '',
			styleBg: 'whiteBG',
			styleSug: 'hideSuggesstionBox',
		};
		//this.postReq = this.postReq.bind(this);
		this.execute = this.execute.bind(this);
		//this.getQuery = this.getQuery.bind(this);
		this.qryChange = this.qryChange.bind(this);
		this.translate = this.translate.bind(this);
		this.suggestions = this.suggestions.bind(this);
		//this.getResultTable = this.getResultTable.bind(this);
		this.setSuggestions = this.setSuggestions.bind(this);
		this.selectSuggestion = this.selectSuggestion.bind(this);
		//this.extractEntityArray = this.extractEntityArray.bind(this);
		//this.extractEntityWithKeys = this.extractEntityWithKeys.bind(this);
	}

	qryChange(e) {
		const key = e.target.value;
		this.setState({
			qry: key
		});
		if (key.length > 2 ) {
			this.suggestions();
		}
	}

	suggestions() {
		var val = Utils.getQuery(this.state.qry);
		if (val.length > 2 ) {
			return;
		}
		this.setState({
			styleBg: 'loadingBG',
			elsQry: "Searching ..."
		});
		console.log(process.env);
		Utils.postReq(process.env.REACT_APP_POLICY_RUNNER + '/suggestKey', "query=" + val,
			(response, err) => {
				if (err) {
					this.setState({
						elsQry: 'Request Failed with ' + err
					});
					return;
				} else {
					console.log("Res: ", response.data);
					this.setSuggestions(response.data);
				}
			});
	}

	translate() {
		Utils.postReq(process.env.REACT_APP_POLICY_RUNNER + '/translate', {
				"query": this.state.qry
			}, (response, err) => {
				if (err) {
					this.setState({
						elsQry: 'Request Failed with ' + err
					});
					return;
				} else {
					var pretty = JSON.stringify(response.data, undefined, 4);
					console.log("Res: ", pretty);
					this.setState({
						elsQry: pretty
					});
					setTimeout(() => {
						this.execute(response.data);
					}, 1000);
				}
			});
	}

	execute(query) {
		const params = "query=" + JSON.stringify(query.query)
			+ "&cls=com.synectiks.commons.entities.SourceEntity"
			+ "&pageNo=1&pageSize=10&notOnlyIds=true";
			Utils.postReq(process.env.REACT_APP_SEARCH_URL + '/search/elsQuery',
			params, (response, err) => {
				if (err) {
					this.setState({
						elsQry: 'Request Failed with ' + err
					});
					return;
				} else {
					var pretty = JSON.stringify(response.data, undefined, 4);
					console.log("Res: ", pretty);
					var rec = 0;
					var resTable = '';
					if (response.data && response.data.hits) {
						rec = response.data.hits.total;
					}
					resTable = Utils.getResultTable(rec, response.data);
					this.setState({
						elsQry: "Found " + rec + " matches.",
						resTbl: resTable
					});
				}
			}
		);
	}

	setSuggestions(data) {
		if (data && Array.isArray(data)) {
			var html = Utils.getSuggestionList(data);
			this.setState({
				suggestns: html,
				styleBg: 'whiteBG',
				styleSug: 'showSuggesstionBox',
				elsQry: "Searching has found " + data.length + " records"
			});
		}
	}

	selectSuggestion(e) {
		if(e.target.tagName === 'LI') {
			const val = e.target.id;
			var prev = this.state.qry;
			var res = Utils.getQuery(prev);
			var sel = prev.replace(new RegExp(res + '$'), val);
			this.setState({
				qry: sel,
				suggestns: '',
				styleBg: 'whiteBG',
				styleSug: 'hideSuggesstionBox',
				elsQry: "You have selected: " + val
			});
		}
		e.preventDefault();
	}

	render() {
		const id = this.props.id || "qp";
		return (
			<div>
				<div>
					<label htmlFor={`${id}query`}>Query:</label>
					<input type="text" id={`${id}query`} value={this.state.qry}
						onChange={ this.qryChange } className={ this.state.styleBg }
						style={{ width: '100%' }} placeholder="Enter your query string..." />
					<div onClick={ this.selectSuggestion } className="suggesstionBox"
						dangerouslySetInnerHTML={{__html: this.state.suggestns}}></div>
				</div>
				<div style={{textAlign: "center"}}>
					<input id="submit" type="button" value="Translate"
						onClick={this.translate} />
					<br/>
					<pre className='maxHeight'>{this.state.elsQry}</pre>
				</div>
				<div dangerouslySetInnerHTML={{__html: this.state.resTbl}}></div>
			</div>
		);
	}
}
