import React from "react";
import "./App.css";
import Inspect from "./Inspect";
import Gallery from "./Gallery";
import { randomNumber } from "./helpers";

class Home extends React.Component {
  state = {
    inspected: null,
    shoeData: [...Array(30)].map(x => ({
      ...GALLERY_DATA[randomNumber(0, 3)],
      lowest_ask: randomNumber(70, 120),
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

const GALLERY_DATA = [
  {
    name: "Jordan 4 Retro Travis Scott Cactus Jack",
    url:
      "https://stockx-360.imgix.net/Air-Jordan-4-Retro-Travis-Scott-Cactus-Jack/Images/Air-Jordan-4-Retro-Travis-Scott-Cactus-Jack/Lv2/"
  },
  {
    name: "adidas Yeezy Boost 350 V2 Butter",
    url:
      "https://stockx-360.imgix.net/Adidas-Yeezy-Boost-350-V2-Butter/Images/Adidas-Yeezy-Boost-350-V2-Butter/Lv2/"
  },
  {
    name: "Nike SB Dunk High Future Court Red",
    url:
      "https://stockx-360.imgix.net/nike-sb-dunk-high-future-court-red_TruView/Images/nike-sb-dunk-high-future-court-red_TruView/Lv2/"
  }
];
