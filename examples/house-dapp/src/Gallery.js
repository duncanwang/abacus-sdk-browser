import React from "react";
import "./App.css";

class Gallery extends React.Component {
  render() {
    return (
      <div className="gallery">
        {[...Array(10)].map((x, i) => (
          <div className="item" key={i}>
            <div className="img">
              <img src="https://photos.zillowstatic.com/p_f/IS6uic30zqgwrw0000000000.jpg" />
              <div>
                <span>$1,000</span>
                <span>2 beds - 2 bath</span>
              </div>
            </div>
            <h1>Test House</h1>
          </div>
        ))}
      </div>
    );
  }
}

export default Gallery;
