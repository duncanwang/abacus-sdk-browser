import React from "react";
import "./App.css";
import Gallery from "./Gallery";
import Settings from "./Settings";
import Inspect from "./Inspect";

class App extends React.Component {
  state = {
    inspected: null
  };
  render() {
    return (
      <div className="App">
        <div className="header">
          <h1 className="title">House Marketplace DApp</h1>
          <button className="login">Log in</button>
        </div>
        <Gallery
          data={FAKE_DATA}
          onClick={x => this.setState({ inspected: x })}
        />
        <Settings />
        <Inspect
          inspected={this.state.inspected}
          onexit={() => this.setState({ inspected: null })}
        />
      </div>
    );
  }
}

export default App;

const FAKE_DATA = [
  {
    owner: "Jerry Nguyen",
    photo: "https://photos.zillowstatic.com/p_f/IS6uic30zqgwrw0000000000.jpg",
    bed: 2,
    bath: 2,
    price: 10000,
    address: "2101 Bryant St. apt 104",
    csz: "San Francisco, CA 94110"
  },
  {
    owner: "Tommy Hillfinger",
    photo: "https://photos.zillowstatic.com/p_f/IS62h4qdicipus0000000000.jpg",
    bed: 2,
    bath: 3,
    price: 12000,
    address: "2123 Zillow St. apt 114",
    csz: "San Francisco, CA 94110"
  },
  {
    owner: "Vitalik Buterin",
    photo: "https://photos.zillowstatic.com/p_f/ISahj3k1s0w1ow0000000000.jpg",
    bed: 2,
    bath: 1,
    price: 15000,
    address: "2203 Coolie St. apt 123",
    csz: "San Francisco, CA 94110"
  }
];
