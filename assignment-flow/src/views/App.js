import '../style/App.css';
import React from 'react';
import Home from './home/Home';
import Wizard from './wizard/Wizard';
import Assignment from './assignment/Assignment';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";



export default class App extends React.Component {

	render() {
		return (
			<Router>
				<Switch>
					<Route exact path="/" component={Home} />
					<Route path="/assignment" component={Assignment} />
					<Route path="/wizard" component={Wizard} />
				</Switch>
			</Router>
		);
	}
}
