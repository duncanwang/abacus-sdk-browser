import React, { Component } from 'react';
import sso from '@abacusprotocol/sso';

class App extends Component {
  componentDidMount() {
    console.log(sso);
    sso.init({
      portalURL: "https://identity.abacusprotocol.com",
      apiURL: "https://backend.abacusprotocol.com",
      application: "e8ea696f-20ed-43b3-84ac-68d372959e6a"
    });
  }
  render() {
    return (
      <div className="App">
        <button
          type="primary"
          onClick={() => {
            sso.openModal({
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
            const result = await sso.fetchVerificationStatus(
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
