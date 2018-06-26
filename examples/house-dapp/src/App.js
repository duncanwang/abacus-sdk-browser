import React from "react";
import "./App.css";
import Gallery from "./Gallery";
import Settings from "./Settings";
import Inspect from "./Inspect";
import {
  APPID,
  HOUSECONTRACT,
  generateHouses,
  randomName,
  getAllHouses
} from "./helpers";
import Abacus from "@abacusprotocol/client-sdk";

class App extends React.Component {
  state = {
    inspected: null,
    reset: false,
    houseData: [],
    user: null,
    userData: null
  };
  async componentDidMount() {
    // how do I create an application ID?
    this.abacus = new Abacus({
      portalURL: "http://identity.abacusprotocol.com",
      applicationId: APPID,
      requireKYC: false
    });
    if (this.state.reset === true) {
      generateHouses(this.abacus);
    }
    const houseData = await getAllHouses(this.abacus);
    this.setState({
      user: this.abacus.readAuthToken(),
      houseData: houseData.map(x => ({
        ...((x && x.ethereum && x.ethereum.commitments) || {}),
        ...x.private
      }))
    });
    this._updateUser();
  }
  async componentDidUpdate(prevProps, prevState) {
    if (this.state.user && this.state.user !== prevState.user) {
      this._updateUser();
    }
  }
  _updateUser = async () => {
    const userData = await this.abacus.getUserAnnotations();
    if (!userData.private || !userData.private.name) {
      await this.abacus.setUserAnnotations({
        private: {
          name: randomName(),
          balance: 100000,
          location: "Japan"
        }
      });
    }
    this.setState({
      userData: { meta: this.abacus.readAuthToken(), ...userData }
    });
  };
  render() {
    console.log(this.state.user, this.state.userData);
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
        <Settings data={this.state.userData} />
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
