import React from 'react';
import './../css/App.css';
import './components/tabs/Tabs.css';
import Tabs from './components/tabs/Tabs.js';
import Sample from './views/sample/Sample.js';
import SurveyCreator from './views/sample/SurveyCreator.js';
import Rules from './views/rules/Rules.js';
import QueryPanel from '@synectiks/oak/search-plugin';

class App extends React.Component {
	render() {
		return (
			<div className="App">
				<div>
					<h1>Policy Runner</h1>
					<Tabs>
						<div label="Translator">
							<QueryPanel id="trans"/>
						</div>
						<div label="Create Rule">
							<Rules/>
						</div>
						<div label="Create Policy">
							After 'while, <em>Create Policy</em>!
						</div>
						<div label="Execute Policy">
							Nothing to see here, this tab is <em>Execute Policy</em>!
						</div>
						<div label="SurveyJs-Sample">	
							<Sample />
						</div>
						<div label="Survey Creator">	
							{/*If you do not want to show Survey Creator, comment the line below*/}
							<h1>SurveyJS Creator in action:</h1>
							<SurveyCreator />
						</div>
					</Tabs>
				</div>
			</div>
		);
	}
}

export default App;