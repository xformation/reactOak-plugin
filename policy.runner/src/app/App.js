import React from 'react';
import './../css/App.css';
import './components/tabs/Tabs.css';
import Tabs from './components/tabs/Tabs.js';
//import Sample from './views/sample/Sample.js';
//import SurveyCreator from './views/sample/SurveyCreator.js';
import Rules from './views/rules/Rules.js';
import Policy from './views/Policy.js';
import Executor from './views/Executor.js';
import QueryPanel from './components/query/QueryPanel.js';
import SyncTable from './components/table/SyncTable.js';
import StudentForm from './views/student/StudentForm';
import Filters from './components/filters/Filters';
import Utils from './../utils/Utils';

class App extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			result: ''
		}

		this.resHandler = this.resHandler.bind(this);
	}

	resHandler(data) {
		let html = '';
		if (data && Array.isArray(data)) {
			html = Utils.createTableByArray(data);
		}
		this.setState({
			result: html
		})
	}

	render() {
		return (
			<div className="App">
				<div>
					<h1>Policy Runner</h1>
					<Tabs>
						<div label="Filters">
							<Filters json={Filters.INPUTJSON} resultCallback={this.resHandler} isApply="true"/>
							<div dangerouslySetInnerHTML={{__html: this.state.result}}></div>
						</div>
						<div label="Student Form">
							<StudentForm/>
						</div>
						<div label="Sample Demo Table">
							<SyncTable/>
						</div>
						<div label="Translator">
							<QueryPanel id="trans" isTranslate="true"/>
						</div>
						<div label="Create Rule">
							<Rules/>
						</div>
						<div label="Create Policy">
							<Policy/>
						</div>
						<div label="Execute Policy">
							<Executor/>
						</div>
						{/*<div label="SurveyJs-Sample">	
							<Sample />
						</div>
						<div label="Survey Creator">	
							//If you do not want to show Survey Creator, comment the line below
							<h1>SurveyJS Creator in action:</h1>
							<SurveyCreator />
						</div>*/}
					</Tabs>
				</div>
			</div>
		);
	}
}

export default App;
