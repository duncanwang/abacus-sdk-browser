import React from "react";
import "./App.css";
import Gallery from "./Gallery";
import Settings from "./Settings";
import Inspect from "./Inspect";

class App extends React.Component {
  state = {
    inspected: null
  };

  render() {
    return (
      <div className="App">
        <div className="header">
          <h1 className="title">Abacus Shoe Marketplace</h1>
          {!this.state.userData && <button className="login">Log in</button>}
          {this.state.userData && <a>Log out</a>}
        </div>
        <Gallery data={[]} onClick={x => this.setState({ inspected: x })} />
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
