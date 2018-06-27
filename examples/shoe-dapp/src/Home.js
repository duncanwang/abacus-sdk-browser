import React from "react";
import "./App.css";
import Inspect from "./Inspect";
import Gallery from "./Gallery";

class Home extends React.Component {
  state = {
    inspected: null
  };
  render() {
    return (
      <div className="home">
        <div className="search-wrapper">
          <input placeholder="filter by brand, color, etc." />
          <button>Search</button>
        </div>
        <Gallery data={[]} onClick={x => this.setState({ inspected: x })} />
        <Inspect
          inspected={this.state.inspected}
          onExit={() => this.setState({ inspected: null })}
        />
      </div>
    );
  }
}

export default Home;
