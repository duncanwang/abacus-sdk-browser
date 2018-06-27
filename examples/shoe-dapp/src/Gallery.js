import React from "react";
import "./App.css";
import { randomNumber } from "./helpers";

class Gallery extends React.Component {
  render() {
    const { data, onClick } = this.props;
    return (
      <div className="gallery">
        {data.map((info, i) => {
          return (
            <div className="item" key={i} onClick={() => onClick(info)}>
              <img src={info.photo} />
              <div className="desc">
                <h1>{info.name}</h1>
                <span>${randomNumber(120, 0.4)}</span>
                <span>lowest ask</span>
                <span>{randomNumber(10, 0.5)} minutes ago</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default Gallery;
