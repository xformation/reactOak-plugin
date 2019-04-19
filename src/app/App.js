import React, { Component } from "react";
import UploadFile from "./components/UploadFile";
import { ApolloProvider } from "react-apollo";
import Utils from "./utils/Utils";
import logo from "../static/images/logo.svg";
import "../static/style/App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <div>
          <ApolloProvider client={Utils.getApolloClient()}>
            <UploadFile />
          </ApolloProvider>
        </div>
      </div>
    );
  }
}

export default App;
