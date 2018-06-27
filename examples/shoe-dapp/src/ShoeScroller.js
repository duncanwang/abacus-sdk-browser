import React from "react";
import "./App.css";

class ShoeScroller extends React.Component {
  render() {
    const { url } = this.props;
    return <div className="shoe-scroller">{url}</div>;
  }
}

export default ShoeScroller;
