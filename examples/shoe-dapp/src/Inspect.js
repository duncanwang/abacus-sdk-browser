import React from "react";
import "./App.css";
import { Link } from "react-router-dom";

class Inspect extends React.Component {
  render() {
    const { inspected, onExit, disabled, onPurchase } = this.props;
    if (!inspected) return null;
    return (
      <div className="inspect">
        <button className="exit" onClick={onExit}>
          x
        </button>
        <div className="img">
          <img src={inspected.url + "img36.jpg"} />
        </div>
        <div className="details">
          <h1>{inspected.name}</h1>
          <div className="meta">
            <p>{inspected.time} minutes ago</p>
          </div>
          <p className="address">lowest ask: ${inspected.lowest_ask}</p>
          <Link className="btn-bottom" to="/shoe">
            <button className="purchase">Detailed Information</button>
          </Link>
        </div>
      </div>
    );
  }
}

export default Inspect;
