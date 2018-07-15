import "@babel/polyfill";
import fetch from "isomorphic-unfetch";
import * as qs from "qs";

const AbacusError = (message, name = null)=> {
  var instance = new Error("Abacus Error:" + message);
  instance.name = name || instance.name;
  return instance;
};

const parseJWT = token => {
  if (typeof token !== "string") return null;
  return JSON.parse(atob(token.split(".")[1]));
};

/**
 * Abacus SDK main class.
 */
class Abacus {
  _portalHost: string;
  _apiHost: string;
  _applicationId: string | null;
  _displaying: boolean;
  _exists: boolean;

  MODAL_ID: string;

  /**
   * Instantiates the Abacus SDK.
   *
   * @param {Object} params
   * @param {Object} params.authToken An auth token to use the API with, if it exists.
   * @param {Object} params.applicationId The ID of your application. You can obtain this at https://identity-dev.abacusprotocol.com/application/admin/create_application.
   * @param {Object} params.portalHost The host url of the Abacus Portal dApp.
   * @param {Object} params.apiHost The host url of the Abacus API.
   */
  constructor(params) {
    if (!params.applicationId)
      throw AbacusError("Application ID is required ");

    this._portalHost = params.portalHost || "https://identity-sandbox.abacusprotocol.com"
    this._apiHost = params.apiHost || "https://api-sandbox.abacusprotocol.com"
    this._applicationId = params.applicationId
    this._displaying = false;
    this._exists = false;

    this.MODAL_ID= "abacusSDK";

    if (typeof window === "undefined") {
      if (!params.apiKey) {
        throw AbacusError("Please provide an API key.");
      }
      if (!params.apiSecret) {
        console.warn(
          "Warning: no API secret provided. You should do this to prevent others from performing requests in your name."
        );
      }
      this._authUser = params.apiKey;
      this._apiSecret = params.apiSecret;
    } else {
      this._authUser =
        params.authToken || window.localStorage.abacusAccessToken;
      this._authUserId = window.localStorage.abacusUserId;
    }
    this.baseURL = `${this._apiHost}/api/v1`;
  }

  /**
   * Closes the modal if it's open.
   *
   * @param {function} onClose Called if and when the modal is closed.
   */
  closeModal(onClose) {
    const modal = document.getElementById(this.MODAL_ID);
    if (!modal) return;
    modal.parentNode.removeChild(modal);
    onClose();
  }

  /* AUTHENTICATION METHODS */

  /**
   * Opens the Abacus modal for login and (optionally) user verification.
   *
   * @param {Object} options
   * @param {Array<String>} scope The OAuth scopes to authorize.
   * @param {function} onOpen Called when the modal is opened.
   * @param {function} onClose Called when the modal is closed.
   * @param {Boolean} runVerifications True if the modal should include the verifications flow for the application.
   */
  authorizeWithModal(options) {
    if (!options.scope) {
      options.scope = ["all"];
    }
    const OPTS = {
      onOpen:
        options && typeof options.onOpen === "function"
          ? options.onOpen
          : function() {},
      onClose:
        options && typeof options.onClose === "function"
          ? options.onClose
          : function() {},
      onAuthorize:
        options && typeof options.onAuthorize === "function"
          ? options.onAuthorize
          : function() {},
      runVerifications: !!options.runVerifications || false
    };

    localStorage.genState = Math.floor(Math.random() * 100000000).toString();
    const query = {
      display_type: "modal",
      state: localStorage.genState,
      scope: options.scope.join(",")
    };
    if (this._applicationId) {
      query.client_id = this._applicationId;
    }
    if (OPTS.runVerifications) {
      query.run_verifications = "true";
    }

    const modal = document.createElement("iframe");
    modal.src = this._portalHost + "/auth/login?" + qs.stringify(query);
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
    modal.style.display = "block";

    if (!this._exists) {
      window.addEventListener("click", event => {
        if (event.target != modal && this._displaying) {
          this.closeModal(OPTS.onClose);
        }
      });
      window.addEventListener("message", async event => {
        if (event.data.name === "abacus_oauth") {
          const { code, state, close } = event.data.payload;
          if (close) {
            this.closeModal(OPTS.onClose);
          }
          if (localStorage.genState != state) {
            throw AbacusError("invalid oauth state");
          }
          const { access_token, user_id } = await this._sendPostRequest(
            "/auth/token?" +
              qs.stringify({
                grant_type: "authorization_code",
                code: code,
                client_id: this._applicationId
              })
          );
          window.localStorage.abacusAccessToken = access_token;
          this._authUser = access_token;
          window.localStorage.abacusUserId = user_id;
          this._authUserId = user_id;
          OPTS.onAuthorize({ accessToken: access_token });
          return;
        }
        if (event.data.name !== "abacus") return;
        if (event.data.payload === "modal_close") {
          this.closeModal(OPTS.onClose);
        }
      });
    }

    // weird hack for ensuring event listener doesn't fire
    setTimeout(function() {
      this._displaying = true;
      OPTS.onOpen();
    }, 1);
    this._exists = true;
  }

  async _sendRequest(url, mergeOpts = {}) {
    const res = await fetch(this.baseURL + url, {
      headers: {
        "content-type": "application/json",
        Authorization: "Token " + this._authUser
      },
      ...mergeOpts
    });
    return await res.json();
  }

  async _sendGetRequest(url) {
    return await this._sendRequest(url);
  }

  async _sendPostRequest(url, data = undefined) {
    return await this._sendRequest(url, {
      method: "POST",
      body: JSON.stringify(data)
    });
  }

  /**
   * deactivate the currently logged in user
   */
  deauthorize() {
    this._authUser = null;
    this._authUserId = null;
    window.localStorage.abacusAccessToken = null;
    window.localStorage.abacusUserId = null;
  }

  /* USER METHODS */

  /**
   * Fetches a list of all identity verifications performed on the user.
   * @returns {Object} A map of verification type to status.
   */
  async fetchVerifications() {
    return await this._sendGetRequest(
      `/applications/${this._applicationId}/users/${
        this._authUserId
      }/verifications`
    );
  }

  /**
   * Gets the URI for token metadata.
   *
   * @param {Object} address The address of the token.
   * @param {Object} tokenId The id of the token.
   */
  getTokenURI({ address, tokenId }) {
    return;
    `${this.baseURL}/applications/${
      this._applicationId
    }/tokens/${address}/${tokenId}/metadata`;
  }

  /* ANNOTATION METHODS */

  /**
   * Writes annotations for the current user.
   *
   * @param {Object} data
   * @param {Object} data.ethereum
   * @param {Object} data.ethereum.bytes32 Key-value mapping of bytes32 data to store on-chain. The key can be any string, and the value must be a hex-encoded string.
   * @param {Object} data.ethereum.bytes Key-value mapping of bytes data to store on-chain. The key can be any string, and the value must be a hex-encoded string.
   * @param {Object} data.private Key-value mapping of data to store off-chain.
   */
  async writeUserAnnotations(data) {
    return await this._sendPostRequest(
      `/applications/${this._applicationId}/users/${
        this._authUserId
      }/annotations`,
      data
    );
  }

  /**
   * Fetches a list of all annotations on the user.
   */
  async fetchUserAnnotations() {
    return await this._sendGetRequest(
      `/applications/${this._applicationId}/users/${
        this._authUserId
      }/annotations`
    );
  }

  /**
   * Writes annotations for a specific token.
   *
   * @param {Object} address The address of the token.
   * @param {Object} tokenId The id of the token.
   * @param {Object} data
   * @param {Object} data.ethereum
   * @param {Object} data.ethereum.bytes32 Key-value mapping of bytes32 data to store on-chain. The key can be any string, and the value must be a hex-encoded string.
   * @param {Object} data.ethereum.bytes Key-value mapping of bytes data to store on-chain. The key can be any string, and the value must be a hex-encoded string.
   * @param {Object} data.private Key-value mapping of data to store off-chain.
   */
  async writeTokenAnnotations({ address, tokenId, data }) {
    return await this._sendPostRequest(
      `/applications/${
        this._applicationId
      }/tokens/${address}/${tokenId}/annotations`,
      data
    );
  }

  /**
   * Fetches a list of all annotations on a specific token.
   *
   * @param {Object} address The address of the token.
   * @param {Object} tokenId The id of the token.
   */
  async fetchTokenAnnotations({ address, tokenId }) {
    return await this._sendGetRequest(
      `/applications/${
        this._applicationId
      }/tokens/${address}/${tokenId}/annotations`
    );
  }
}

export default Abacus;
