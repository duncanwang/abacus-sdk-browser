import React from "react";
import "./App.css";
import { GALLERY_DATA } from "./helpers";
import ShoeScroller from "./ShoeScroller";

class Shoe extends React.Component {
  render() {
    const { shoe_id } = this.props.match.params;
    const meta = GALLERY_DATA.find(x => x.name === shoe_id.replace(/-/g, " "));
    return (
      <div className="shoe">
        <h1>{meta.name}</h1>
        <div className="mid">
          <ShoeScroller />
        </div>
      </div>
    );
  }
}

export default Shoe;
