import React from "react";
import "./App.css";
import { randomNumber, GALLERY_DATA } from "./helpers";
import ShoeScroller from "./ShoeScroller";

class Shoe extends React.Component {
  lowest_ask = randomNumber(70, 110);
  highest_ask = randomNumber(110, 140);
  render() {
    const { shoe_id } = this.props.match.params;
    const meta = GALLERY_DATA.find(x => x.name === shoe_id.replace(/-/g, " "));
    return (
      <div className="shoe">
        <h1>{meta.name}</h1>
        <div className="mid">
          <ShoeScroller url={meta.url} />
          <div className="desc">
            <div className="item">
              lowest ask: <b>{this.lowest_ask}</b>
            </div>
            <div className="item">
              highest ask: <b>{this.lowest_ask}</b>
            </div>
            <div className="item">
              <button>sell</button>
            </div>
            <div className="item">
              <button>buy</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Shoe;
