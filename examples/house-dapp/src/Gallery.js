import React from "react";
import "./App.css";

class Gallery extends React.Component {
  render() {
    const { data, onClick } = this.props;
    return (
      <div className="gallery">
        {data.map((info, i) => {
          return (
            <div className="item" key={i} onClick={() => onClick(info)}>
              <div className="img">
                <img src={info.photo} />
                <div>
                  <span>${info.price}</span>
                  <span>
                    {info.bed} beds - {info.bath} bath
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default Gallery;
