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
        <Gallery
          data={GALLERY_DATA}
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
    name: "Nike SB Dunk High Future Court Obsidian",
    url:
      "https://stockx-360.imgix.net/nike-sb-dunk-high-future-court-obsidian_TruView/Images/nike-sb-dunk-high-future-court-obsidian_TruView/Lv2/"
  }
];
