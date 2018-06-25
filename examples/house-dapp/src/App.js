import React from "react";
import "./App.css";
import Gallery from "./Gallery";
import Settings from "./Settings";
import Inspect from "./Inspect";
import {
  APPID,
  BURL,
  HOUSECONTRACT,
  generateHouses,
  getAllHouses
} from "./helpers";
import Abacus from "@abacusprotocol/client-sdk";

class App extends React.Component {
  state = {
    inspected: null,
    reset: false,
    houseData: [],
    user: null
  };
  async componentDidMount() {
    // how do I create an application ID?
    this.abacus = new Abacus({
      portalURL: "http://localhost:3000",
      applicationId: APPID,
      requireKYC: false
    });
    if (this.state.reset === true) {
      generateHouses();
    }
    const houseData = await getAllHouses();
    this.setState({
      houseData: houseData.map(x => ({
        ...x.ethereum.commitments,
        ...x.private
      }))
    });
  }
  render() {
    console.log(this.state.user);
    return (
      <div className="App">
        <div className="header">
          <h1 className="title">House Marketplace DApp</h1>
          <button
            className="login"
            onClick={() =>
              this.abacus.authorizeWithModal({
                onClose: () => {
                  this.setState({ user: this.abacus.readAuthToken() });
                }
              })
            }
          >
            Log in
          </button>
        </div>
        <Gallery
          data={this.state.houseData}
          onClick={x => this.setState({ inspected: x })}
        />
        <Settings />
        <Inspect
          inspected={this.state.inspected}
          onExit={() => this.setState({ inspected: null })}
        />
      </div>
    );
  }
}

export default App;

const FAKE_DATA = [
  {
    owner: "Jerry Nguyen",
    photo: "",
    bed: 2,
    bath: 2,
    price: 10000,
    location: "Japan"
  },
  {
    owner: "Tommy Hillfinger",
    photo: "https://photos.zillowstatic.com/p_f/IS62h4qdicipus0000000000.jpg",
    bed: 2,
    bath: 3,
    price: 12000,
    location: "United States"
  },
  {
    owner: "Vitalik Buterin",
    photo: "https://photos.zillowstatic.com/p_f/ISahj3k1s0w1ow0000000000.jpg",
    bed: 2,
    bath: 1,
    price: 15000,
    location: "Japan"
  }
];
