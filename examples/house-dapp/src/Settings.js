import React from "react";
import "./App.css";
import md5 from "js-md5";

class Settings extends React.Component {
  render() {
    return (
      <div className="settings">
        <h1>User Settings</h1>
        <div className="head">
          <img
            className="profile_picture"
            src={`https://www.gravatar.com/avatar/${md5("")}?d=identicon&s=400`}
          />
          <h1>John Doe</h1>
        </div>
        <div className="item">
          <span className="label">
            Available Funds: <b>1000000</b>
          </span>
        </div>
        <div className="item">
          <span className="label">
            Location: <b>Japan</b>
          </span>
          <button>Switch to United States</button>
        </div>
      </div>
    );
  }
}

export default Settings;
