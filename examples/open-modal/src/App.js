import React, { Component } from 'react';
import Abacus from '@abacusprotocol/client-sdk';

class App extends Component {
  componentDidMount() {
    this.abacus = new Abacus({
      portalURL: "http://localhost:3000",
      apiURL: "https://api.abacusprotocol.com",
      applicationId: "e8ea696f-20ed-43b3-84ac-68d372959e6a"
    });
    console.log(this.abacus)
  }
  render() {
    return (
      <div className="App">
        <button
          type="primary"
          onClick={() => {
            this.abacus.authorizeWithModal({
              onClose() {
                console.log("test123");
              }
            });
          }}
        >
          Login with Abacus
        </button>
        <button
          type="primary"
          onClick={async () => {
            const result = await this.abacus.fetchVerificationStatus(
              // @ts-ignore
              window.web3.eth.defaultAccount
            );
            alert(JSON.stringify(result));
          }}
        >
          Show info
        </button>
      </div>
    );
  }
}

export default App;
