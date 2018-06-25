import React from "react";
import "./App.css";

class Inspect extends React.Component {
  render() {
    return (
      <div className="inspect">
        <button className="exit">x</button>
        <h1>Test House</h1>
        <div className="img">
          <img src="https://photos.zillowstatic.com/p_f/IS6uic30zqgwrw0000000000.jpg" />
        </div>
        <div className="details">
          <div>
            <p>
              price: <b>$10000</b>
            </p>
            <p>
              <b>2 bed</b> - <b>2 bath</b>
            </p>
          </div>
          <p className="address">
            2101 BRYANT ST APT 104 <br />San Francisco, CA 94110
          </p>
        </div>
      </div>
    );
  }
}

export default Inspect;
