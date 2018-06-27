import React from "react";
import "./App.css";

class ShoeScroller extends React.Component {
  state = {
    pos: 36
  };
  render() {
    const { url } = this.props;
    return (
      <div className="shoe-scroller">
        <img src={url + "img" + this.state.pos + ".jpg"} />
        <input
          type="range"
          min="1"
          max="36"
          onChange={e =>
            this.setState({
              pos: e.target.value < 10 ? "0" + e.target.value : e.target.value
            })
          }
          value={this.state.pos}
          class="slider"
        />
      </div>
    );
  }
}

export default ShoeScroller;
