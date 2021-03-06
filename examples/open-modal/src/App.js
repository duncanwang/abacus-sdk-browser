import React, { Component } from "react";
import Abacus from "@abacusprotocol/sdk-browser";

class App extends Component {
  componentDidMount() {
    this.abacus = new Abacus({
      portalURL: "https://identity-sandbox.abacusprotocol.com",
      apiURL: "https://api-sandbox.abacusprotocol.com",
      applicationId: "e8ea696f-20ed-43b3-84ac-68d372959e6a"
    });
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
            const result = await this.abacus.fetchUserVerifications();
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
