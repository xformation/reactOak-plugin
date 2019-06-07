import React from 'react';
import * as Survey from "survey-react";
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
widgets.select2(Survey, $);
widgets.inputmask(Survey);
widgets.jquerybarrating(Survey, $);
widgets.jqueryuidatepicker(Survey, $);
widgets.nouislider(Survey);
widgets.select2tagbox(Survey, $);
widgets.signaturepad(Survey);
widgets.sortablejs(Survey);
widgets.ckeditor(Survey);
widgets.autocomplete(Survey, $);
widgets.bootstrapslider(Survey);

export default class Sample extends React.Component {
	//Define Survey JSON
	//Here is the simplest Survey with one text question
	json = {};
	modal = {};

	constructor(props) {
		super(props);
		this.setJson = this.setJson.bind(this);
		this.getModal = this.getModal.bind(this);
		this.onComplete = this.onComplete.bind(this);
		this.getView = this.getView.bind(this);
	}

	setJson(jsn) {
		this.json = jsn;
	}

	getModal() {
		return this.modal;
	}

	onComplete(result) {
		console.log("Complete: ", result.data);
		this.result = result.data;
	}

	getView(btnName = 'Save') {
		this.modal = new Survey.Model(this.json);
		this.modal.onComplete
			.add(function (survey, options) {
				survey.clear(false, true);
				survey.render();
			});
		return (
			<Survey.Survey model={this.modal} completeText={btnName}
				showCompletedPage='false' onComplete={this.onComplete} />
		);
	}
}
