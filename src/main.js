import "@babel/polyfill";
import fetch from "isomorphic-unfetch";

var ERRORS = {
  AUTH: "AuthenticationError"
};

function AbacusError(message, name) {
  var instance = new Error("Abacus Err:" + message);
  instance.name = name || instance.name;
  return instance;
}

var closeModal = function(displaying, modal, onClose) {
  if (!_displaying) return;
  modal.style.display = "none";
  _displaying = false;
  onClose();
};

class Abacus {
  constructor(params) {
    if (!params.applicationId)
      throw new AbacusError("Please provide an application ID");
    this._opts = {
      portalURL: params.portalURL || "https://identity.abacusprotocol.com",
      apiURL: params.apiURL || "https://api.abacusprotocol.com",
      applicationId: params.applicationId,
      requireKYC: !!params.requireKYC || false
    };
    this.MODAL_ID = "abacusSDK";
    this._displaying = false;
    this._exists = false;
    if (typeof window === "undefined") {
      this._authUser = params.authToken;
    } else {
      this._authUser = params.authToken || window.localStorage.abacusUserToken;
    }
  }

  /* AUTHENTICATION METHODS */

  authorizeWithModal(options) {
    var OPTS = {
      onOpen:
        options && typeof options.onOpen === "function"
          ? options.onOpen
          : function() {},
      onClose:
        options && typeof options.onClose === "function"
          ? options.onClose
          : function() {}
    };

    var modal = document.getElementById(this.MODAL_ID);
    if (!modal) {
      modal = document.createElement("iframe");
      modal.src =
        (this._opts.portalURL || "http://localhost:3000") +
        "/modal/login?" +
        (this._opts.applicationId
          ? "application=" + this._opts.applicationId + "&"
          : "") +
        (this._opts.requireKYC ? "requireKYC=true&" : "");
      modal.width = "100%";
      modal.height = "100%";
      modal.frameBorder = "0";
      modal.style.position = "fixed";
      modal.style.zIndex = "1337";
      modal.id = this.MODAL_ID;
      modal.style.left = "0";
      modal.style.top = "0";
      modal.style.overflow = "hidden";
      document.body.appendChild(modal);
    }
    OPTS.onOpen();
    modal.style.display = "block";

    if (!this._exists) {
      window.addEventListener("click", function(event) {
        if (event.target != modal && this._displaying) {
          closeModal(this._displaying, modal, OPTS.onClose);
        }
      });
      window.addEventListener("message", function(event) {
        // TODO: deprecated this part
        if (event.data === "abacus_modal_close") {
          closeModal(this._displaying, modal, OPTS.onClose);
        }
        if (event.data.name !== "abacus") return;
        if (event.data.payload === "modal_close") {
          closeModal(this._displaying, modal, OPTS.onClose);
        }
        if (event.data.payload.appToken) {
          this._authUser = event.data.payload.appToken;
          window.localStorage.abacusUserToken = this._authUser;
        }
      });
    }

    // weird hack for ensuring event listener doesn't fire
    setTimeout(function() {
      this._displaying = true;
    }, 1);
    this._exists = true;
  }

  async _sendRequest(url, data, mergeOpts = {}) {
    const baseURL = `${this._opts.apiURL}/api/v1`;
    const res = await fetch(baseURL + url, {
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + this._authUser
      },
      ...mergeOpts
    });
    return await response.json();
  }

  async _sendGetRequest(url, data) {
    return await this._sendRequest(url, data);
  }

  async _sendPostRequest(url, data) {
    return await this._sendRequest(url, data, {
      method: "POST",
      body: JSON.stringify(data)
    });
  }

  parseToken(token) {
    if (typeof token !== "string") return null;
    return JSON.parse(atob(token.split(".")[1]));
  }

  readAuthToken() {
    return this.parseToken(this._authUser);
  }

  deauthorize() {
    this._authUser = null;
    window.localStorage.abacusUserToken = null;
  }

  /* USER METHODS */

  async fetchVerifications() {
    const user = this.readAuthToken();
    return await this._sendGetRequest(
      `/applications/${this._opts.applicationId}/users/${
        user.userId
      }/verifications`,
      data
    );
  }

  /* ANNOTATION METHODS */

  async writeUserAnnotations(data) {
    const user = this.readAuthToken();
    return await this._sendPostRequest(
      `/applications/${this._opts.applicationId}/users/${
        user.userId
      }/annotations`,
      data
    );
  }

  async fetchUserAnnotations() {
    const user = this.readAuthToken();
    return await this._sendGetRequest(
      `/applications/${this._opts.applicationId}/users/${
        user.userId
      }/annotations`,
      data
    );
  }

  async writeTokenAnnotations({ address, tokenId, data }) {
    return await this._sendPostRequest(
      `/applications/${
        this._opts.applicationId
      }/tokens/${address}/${tokenId}/annotations`,
      data
    );
  }

  async fetchTokenAnnotations({ address, tokenId }) {
    return await this._sendGetRequest(
      `/applications/${
        this._opts.applicationId
      }/tokens/${address}/${tokenId}/annotations`,
      data
    );
  }
}

export default Abacus;
