import React from "react";
import "./App.css";
import Inspect from "./Inspect";
import Gallery from "./Gallery";
import { randomNumber, GALLERY_DATA } from "./helpers";

class Home extends React.Component {
  state = {
    inspected: null,
    shoeData: [...Array(30)].map(x => ({
      ...GALLERY_DATA[randomNumber(0, 3)],
      lowest_ask: randomNumber(70, 110),
      time: randomNumber(5, 10)
    }))
  };
  render() {
    return (
      <div className="home">
        <div className="search-wrapper">
          <input placeholder="filter by brand, color, etc." />
          <button>Search</button>
        </div>
        <Gallery
          data={this.state.shoeData}
          onClick={x => this.setState({ inspected: x })}
        />
        <Inspect
          inspected={this.state.inspected}
          onExit={() => this.setState({ inspected: null })}
        />
      </div>
    );
  }
}

export default Home;

