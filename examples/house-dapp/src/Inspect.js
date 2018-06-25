import React from "react";
import "./App.css";

class Inspect extends React.Component {
  render() {
    const { inspected, onExit } = this.props;
    if (!inspected) return null;
    return (
      <div className="inspect">
        <button className="exit" onClick={onExit}>
          x
        </button>
        <h1>{inspected.owner}'s House</h1>
        <div className="img">
          <img src={inspected.photo} />
        </div>
        <div className="details">
          <div className="meta">
            <p>
              price: <b>${inspected.price}</b>
            </p>
            <p>
              <b>{inspected.bed} bed</b> - <b>{inspected.bath} bath</b>
            </p>
          </div>
          <p className="address">
            location: <b>{inspected.location}</b>
          </p>
          <button className="purchase">Purchase</button>
        </div>
      </div>
    );
  }
}

export default Inspect;
