import React from "react";
import "./App.css";
import Gallery from "./Gallery";
import Settings from "./Settings";
import Inspect from "./Inspect";
import { APPID, HOUSECONTRACT, randomName, getAllHouses } from "./helpers";
import Abacus from "@abacusprotocol/client-sdk";

class App extends React.Component {
  state = {
    inspected: null,
    houseData: [],
    user: null,
    userData: null,
    disablePurchase: true
  };

  async componentDidMount() {
    this.abacus = new Abacus({
      portalURL: "http://identity.abacusprotocol.com",
      applicationId: APPID,
      requireKYC: false
    });
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
      disablePurchase: false,
      userData: { meta: this.abacus.readAuthToken(), ...userData }
    });
  };

  _onPurchase = async (id, price) => {};

  render() {
    return (
      <div className="App">
        <div className="header">
          <h1 className="title">House Marketplace DApp</h1>
          {!this.state.userData && (
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
          )}
          {this.state.userData && (
            <a
              onClick={() => {
                this.abacus.deauthorize();
                this.setState({
                  disablePurchase: true,
                  user: null,
                  userData: null
                });
              }}
            >
              Log out
            </a>
          )}
        </div>
        <Gallery
          data={this.state.houseData}
          onClick={x => this.setState({ inspected: x })}
        />
        <Settings data={this.state.userData} />
        <Inspect
          disabled={this.state.disablePurchase}
          onPurchase={this._onPurchase}
          inspected={this.state.inspected}
          onExit={() => this.setState({ inspected: null })}
        />
      </div>
    );
  }
}

export default App;
