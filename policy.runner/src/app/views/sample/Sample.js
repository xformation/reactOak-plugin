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
	json = {
		title: "Product Feedback Survey Example",
		showProgressBar: "top",
		pages: [
			{
				elements: [
					{
						"type": "radiogroup",
						"name": "position",
						"title": "Choose job position...",
						"isRequired": true,
						"colCount": 0,
						"choices": ["1|Designer", "2|Front-end Developer", "3|Back-end Developer", "4|Database Administrator", "5|System Engineer"]
					},
					{
						type: "barrating",
						name: "barrating1",
						ratingTheme: "css-stars",
						title: "Please rate the movie you've just watched",
						choices: ["1", "2", "3", "4", "5"]
					},
					{
						type: "imagepicker",
						name: "choosepicture",
						title: "What animal would you like to see first ?",
						choices: [
							{
								value: "lion",
								imageLink:
									"https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg"
							},
							{
								value: "giraffe",
								imageLink:
									"https://surveyjs.io/Content/Images/examples/image-picker/giraffe.jpg"
							},
							{
								value: "panda",
								imageLink:
									"https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg"
							},
							{
								value: "camel",
								imageLink:
									"https://surveyjs.io/Content/Images/examples/image-picker/camel.jpg"
							}
						]
					},
					{
						type: "bootstrapslider",
						name: "bootstrapslider"
					},
					{
						type: "dropdown",
						renderAs: "select2",
						choicesByUrl: {
							url: "https://restcountries.eu/rest/v1/all"
						},
						name: "countries",
						title: "Please select the country you have arrived from:"
					},
					{
						type: "signaturepad",
						name: "sign",
						title: "Please enter your signature"
					},
					{
						type: "sortablelist",
						name: "lifepriopity",
						title: "Life Priorities ",
						isRequired: true,
						colCount: 0,
						choices: ["family", "work", "pets", "travels", "games"]
					},
					{
						name: "date",
						type: "datepicker",
						inputType: "date",
						title: "Your favorite date:",
						dateFormat: "mm/dd/yy",
						isRequired: true
					}
				]
			},
			{
				questions: [
					{
						type: "signaturepad",
						width: "500px",
						name: "Signature Pad - you can enter your signature here:"
					},
					{
						type: "matrix",
						name: "Quality",
						title:
							"Please indicate if you agree or disagree with the following statements",
						columns: [
							{
								value: 1,
								text: "Strongly Disagree"
							},
							{
								value: 2,
								text: "Disagree"
							},
							{
								value: 3,
								text: "Neutral"
							},
							{
								value: 4,
								text: "Agree"
							},
							{
								value: 5,
								text: "Strongly Agree"
							}
						],
						rows: [
							{
								value: "affordable",
								text: "Product is affordable"
							},
							{
								value: "does what it claims",
								text: "Product does what it claims"
							},
							{
								value: "better then others",
								text: "Product is better than other products on the market"
							},
							{
								value: "easy to use",
								text: "Product is easy to use"
							}
						]
					},
					{
						type: "rating",
						name: "satisfaction",
						title: "How satisfied are you with the Product?",
						mininumRateDescription: "Not Satisfied",
						maximumRateDescription: "Completely satisfied"
					},
					{
						type: "rating",
						name: "recommend friends",
						visibleIf: "{satisfaction} > 3",
						title:
							"How likely are you to recommend the Product to a friend or co-worker?",
						mininumRateDescription: "Will not recommend",
						maximumRateDescription: "I will recommend"
					},
					{
						type: "comment",
						name: "suggestions",
						title: "What would make you more satisfied with the Product?"
					}
				]
			},
			{
				questions: [
					{
						type: "radiogroup",
						name: "price to competitors",
						title: "Compared to our competitors, do you feel the Product is",
						choices: [
							"1|Less expensive",
							"2|Priced about the same",
							"3|More expensive",
							"4|Not sure"
						]
					},
					{
						type: "radiogroup",
						name: "price",
						title: "Do you feel our current price is merited by our product?",
						choices: [
							"correct|Yes, the price is about right",
							"low|No, the price is too low for your product",
							"high|No, the price is too high for your product"
						]
					},
					{
						type: "multipletext",
						name: "pricelimit",
						title: "What is the... ",
						items: [
							{
								name: "mostamount",
								title: "Most amount you would every pay for a product like ours"
							},
							{
								name: "leastamount",
								title: "The least amount you would feel comfortable paying"
							}
						]
					}
				]
			},
			{
				questions: [
					{
						type: "text",
						name: "email",
						title:
							'Thank you for taking our survey. Please enter your email address, then press the "Submit" button.'
					}
				]
			}
		]
	};
	onValueChanged(result) {
		console.log("value changed!");
	}
	onComplete(result) {
		console.log("Complete! ", result);
	}

	//Define a callback methods on survey complete
	/*onComplete(survey, options) {
		//Write survey results into database
		console.log("Survey results: " + JSON.stringify(survey.data));
	}*/
	render() {
		//Create the model and pass it into react Survey component
		//You may create survey model outside the render function and use it in your App or component
		//The most model properties are reactive, on their change the component will change UI when needed.
		var model = new Survey.Model(this.json);
		return (<Survey.Survey model={model} onComplete={this.onComplete} />);
		/*
		//The alternative way. react Survey component will create survey model internally
		return (<Survey.Survey json={this.json} onComplete={this.onComplete}/>);
		*/
		//You may pass model properties directly into component or set it into model
		// <Survey.Survey model={model} mode="display"/>
		//or 
		// model.mode="display"
		// <Survey.Survey model={model}/>
		// You may change model properties outside render function. 
		//If needed react Survey Component will change its behavior and change UI.
	}
}
