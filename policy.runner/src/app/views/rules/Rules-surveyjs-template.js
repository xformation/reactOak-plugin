import React from 'react';
import * as Survey from "survey-react";
import "../../components/SurveyJsButton.js"
import "survey-react/survey.css";
import "bootstrap/dist/css/bootstrap.css";

import "jquery-ui/themes/base/all.css";
import "nouislider/distribute/nouislider.css";
import "select2/dist/css/select2.css";
import "bootstrap-slider/dist/css/bootstrap-slider.css";

import "jquery-bar-rating/dist/themes/css-stars.css";

import $ from "jquery";
import "jquery-ui/ui/widgets/datepicker.js";
import "select2/dist/js/select2.js";
import "jquery-bar-rating";

import * as widgets from "surveyjs-widgets";

import "icheck/skins/square/blue.css";
window["$"] = window["jQuery"] = $;
require("icheck");

Survey.StylesManager.applyTheme("default");

widgets.icheck(Survey, $);

export default class RuleTemp extends React.Component {
	json = {
		title: "Create New Rule",
		elements: [
			{
				type: "text",
				name: "name",
				title: "Enter Rule Name ...",
				isRequired: true,
				maxLength: 50,
				startWithNewLine: false
			},
			{
				type: "text",
				name: "entity",
				title: "Enter entity name to be search",
				isRequired: true,
				maxLength: 50,
				startWithNewLine: false
			},
			{
				type: "comment",
				name: "description",
				title: "Enter rule desrption...",
			},
			{
				
				type: "multipletext",
				name: "checks",
				items: [
					{ name: "check1" }
				]
			},
			{
				type: "surveybutton",
				name: "addMore",
				buttonText: "Add More Checks...",
				startWithNewLine: false
			}
		]
	};

	model = new Survey.Model(this.json);

	addItem(name, n) {
		var checks = this.model.getQuestionByName(name.toLowerCase());
		//question.items = []; it will to the bug
		checks.items.splice(0, checks.items.length);
		for (var i = 0; i < n; i++) {
			checks.addItem(name.toLowerCase() + i, name + (i + 1));
		}
	}

	//Define a callback methods on survey complete
	onComplete(survey, options) {
		//Write survey results into database
		console.log("Survey results: ", survey.data);
	}
	render() {
		return (<Survey.Survey model={this.model} onComplete={this.onComplete} />);
	}
}
