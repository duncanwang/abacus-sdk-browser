import React from "react";
import "./App.css";

class Settings extends React.Component {
  render() {
    return (
      <div className="settings">
        {[...Array(10)].map((x, i) => (
          <div className="item" key={i}>
            <span className="label">Setting Option</span>
            <button>Toggle</button>
          </div>
        ))}
      </div>
    );
  }
}

export default Settings;
