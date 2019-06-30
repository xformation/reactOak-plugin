import * as Survey from "survey-react";

const widget = {
	//the widget name. It should be unique and written in lowcase.
	name: "surveybutton",
	//the widget title. It is how it will appear on the toolbox of the SurveyJS Editor/Builder
	title: "Button",
	//the name of the icon on the toolbox. We will leave it empty to use the standard one
	iconName: "",
	//If the widgets depends on third-party library(s) then here you may check if this library(s) is loaded
	widgetIsLoaded: function () {
		//we do not require anything so we just return true.
		return true;
	},
	//SurveyJS library calls this function for every question to check, if it should use this widget instead of default rendering/behavior
	isFit: function (question) {
		//we return true if the type of question is surveybutton
		return question.getType() === 'surveybutton';
	},
	//Use this function to create a new class or add new properties or remove unneeded properties from your widget
	//activatedBy tells how your widget has been activated by: property, type or customType
	//property - it means that it will activated if a property of the existing question type is set to particular value, for example inputType = "date" 
	//type - you are changing the behaviour of entire question type. For example render radiogroup question differently, have a fancy radio buttons
	//customType - you are creating a new type, like in our example "surveybutton"
	activatedByChanged: function (activatedBy) {
		//we do not need to check acticatedBy parameter, since we will use our widget for customType only
		//We are creating a new class and derived it from text question type. It means that text model (properties and fuctions) will be available to us
		Survey.JsonObject.metaData.addClass("surveybutton", [], null, "text");

		//Add new property(s)
		//For more information go to https://surveyjs.io/Examples/Builder/?id=addproperties#content-docs
		Survey.JsonObject.metaData.addProperties("surveybutton", [
			{ name: "buttonText", default: "Click Me" }
		]);
	},
	//If you want to use the default question rendering then set this property to true. We do not need any default rendering, we will use our our htmlTemplate
	isDefaultRender: false,
	//You should use it if your set the isDefaultRender to false
	htmlTemplate: "<div><button></button></div>",
	//The main function, rendering and two-way binding
	afterRender: function (question, el) {
		//el is our root element in htmlTemplate, is "div" in our case
		//get button and set some rpoeprties
		var button = el.getElementsByTagName("button")[0];
		button.innerText = question.buttonText;
		button.onclick = function () {
			question.value = "You have clicked me";
		}
		question.readOnlyChangedCallback = function () {
			if (question.isReadOnly) {
				button.setAttribute('disabled', 'disabled');
			} else {
				button.removeAttribute("disabled");
			}
		};
		// //if question becomes readonly/enabled add/remove disabled attribute
		// question.readOnlyChangedCallback = this.onReadOnlyChangedCallback();
		// //make elements disabled if needed
		// this.onReadOnlyChangedCallback();

	},
	//Use it to destroy the widget. It is typically needed by jQuery widgets
	willUnmount: function (question, el) {
		//We do not need to clear anything in our simple example
	}
}

//Register our widget in singleton custom widget collection
Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "customtype");
