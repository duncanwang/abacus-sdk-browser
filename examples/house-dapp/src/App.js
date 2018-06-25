import React from "react";
import "./App.css";
import Gallery from "./Gallery";
import Settings from "./Settings";
import Inspect from "./Inspect";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <div className="header">
          <h1 className="title">House Marketplace DApp</h1>
          <button className="login">Log in</button>
        </div>
        <Gallery />
        <Settings />
        <Inspect />
      </div>
    );
  }
}

export default App;
