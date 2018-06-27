import React from "react";
import "./App.css";
import Shoe from "./Shoe";
import Home from "./Home";
import { BrowserRouter as Router, Route } from "react-router-dom";

class App extends React.Component {
  state = {
    inspected: null
  };

  render() {
    return (
      <Router>
        <div className="App">
          <div className="header">
            <h1 className="title">Abacus Shoe Marketplace</h1>
            {!this.state.userData && <button className="login">Log in</button>}
            {this.state.userData && <a>Log out</a>}
          </div>
          <Route exact path="/" component={Home} />
          <Route path="/shoe/:shoe_id" component={Shoe} />
        </div>
      </Router>
    );
  }
}

export default App;
