import React from 'react';
import QueryPanel from './components/QueryPanel';
import './css/App.css';

function App() {
	return (
		<div className="App">
			<label>React query component</label>
			<QueryPanel id="qp1" isTranslate="true"/>
		</div>
	);
}

export default App;
