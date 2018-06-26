import React from "react";
import "./App.css";
import md5 from "js-md5";
import { randomName } from "./helpers";

class Settings extends React.Component {
  render() {
    if (!this.props.data)
      return (
        <div className="settings">
          <h1>Please log in to see user settings!</h1>
        </div>
      );
    const { data } = this.props;
    return (
      <div className="settings">
        <h1>User Settings</h1>
        <div className="head">
          <img
            className="profile_picture"
            src={`https://www.gravatar.com/avatar/${md5(data.meta.address)}?d=identicon&s=400`}
          />
          <h1>{data.private.name}</h1>
        </div>
        <div className="item">
          <span className="label">
            address: <b className="address">{data.meta.address}</b>
          </span>
        </div>
        <div className="item">
          <span className="label">
            Available Funds: $<b>{data.private.balance}</b>
          </span>
        </div>
        <div className="item">
          <span className="label">
            Location: <b>{data.private.location}</b>
          </span>
          <button>Switch to United States</button>
        </div>
      </div>
    );
  }
}

export default Settings;
