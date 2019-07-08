import '../style/App.css';
import React from 'react';
import Home from './home/Home';
import Wizard from './wizard/Wizard';
import Assignment from './assignment/Assignment';
import SurveyModal from './components/modals/SurveyModal';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";



export default class App extends React.Component {

	render() {
		return (
			<Router>
				<Switch>
					<Route key="/" exact path="/" component={Home} />
					<Route key="/assignment" path="/assignment" component={Assignment} />
					<Route key="/wizard" path="/wizard" component={Wizard} />
					<Route key="/survey" path="/survey" component={SurveyModal} />
				</Switch>
			</Router>
		);
	}
}
