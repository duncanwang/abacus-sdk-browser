import "@babel/polyfill";
import * as qs from "qs";
import JavascriptSDK, {
  AbacusAnnotations,
  toUserId
} from "@abacusprotocol/sdk-js";

export const AbacusError = (message: string, name?: string) => {
  var instance = new Error("Abacus Error:" + message);
  instance.name = name || instance.name;
  return instance;
};

/**
 * Abacus Browser SDK
 */
class BrowserSDK extends JavascriptSDK {
  _portalURL: string;
  _displaying: boolean;
  _exists: boolean;
  _authToken: string | null;
  _authUserId: string | null;
  baseURL: string;

  private static readonly MODAL_ID = "abacusSDK";

  /**
   * Instantiates the Abacus SDK.
   *
   * @param {Object} params
   * @param {Object} params.apiURL The host url of the Abacus API.
   * @param {Object} params.applicationId The ID of your application. You can obtain this at https://identity-sandbox.abacusprotocol.com/application/admin/create_application.
   * @param {Object} params.portalURL The host url of the Abacus Portal dApp.
   * @param {Object} params.oathToken The oath authentication token to use for requests.
   */
  constructor(params: {
    apiURL?: string;
    applicationId?: string;
    portalURL?: string;
    oauthToken?: string;
  }) {
    super({
      apiURL: params.apiURL,
      applicationId: params.applicationId,
      authToken: params.oauthToken
    });

    this._portalURL = params.portalURL || "https://identity.abacusprotocol.com";
    this._displaying = false;
    this._exists = false;

    this._authToken =
      params.oauthToken || window.localStorage.abacusAccessToken;
    this._authUserId = window.localStorage.abacusUserId;
    this.baseURL = `${this._apiURL}/api/v1`;
  }

  /**
   * Closes the modal if it's open.
   *
   * @param {function} onClose Called if and when the modal is closed.
   */
  closeModal(onClose: () => void) {
    const modal = document.getElementById(BrowserSDK.MODAL_ID);
    if (!modal || !modal.parentNode) return;
    modal.parentNode.removeChild(modal);
    this._exists = false;
    this._displaying = false;
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
   * @param {function} onAuthorize Called when the user is authorized.
   * @param {Boolean} runVerifications True if the modal should include the verifications flow for the application.
   */
  authorizeWithModal(options: {
    scope?: string[];
    onOpen?: () => void;
    onClose?: () => void;
    onAuthorize?: (i: { accessToken: string }) => void;
    runVerifications?: boolean;
    query: object;
  }) {
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
      runVerifications: !!options.runVerifications || false,
      query: options.query || {}
    };

    localStorage.genState = Math.floor(Math.random() * 100000000).toString();
    const query: {
      display_type: string;
      state: string;
      scope: string;
      client_id?: string;
      run_verifications?: string;
    } & { [key: string]: any } = Object.assign(OPTS.query, {
      display_type: "modal",
      state: localStorage.genState,
      scope: options.scope.join(",")
    });
    if (this._applicationId) {
      query.client_id = this._applicationId;
    }
    if (OPTS.runVerifications) {
      query.run_verifications = "true";
    }

    const modal = document.createElement("iframe");
    modal.src = this._portalURL + "/auth/login?" + qs.stringify(query);
    modal.width = "100%";
    modal.height = "100%";
    modal.frameBorder = "0";
    modal.style.position = "fixed";
    modal.style.zIndex = "1337";
    modal.id = BrowserSDK.MODAL_ID;
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
          this._authToken = access_token;
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
    setTimeout(() => {
      this._displaying = true;
      OPTS.onOpen();
    }, 1);
    this._exists = true;
  }

  /**
   * deactivate the currently logged in user
   */
  deauthorize() {
    this._authToken = null;
    this._authUserId = null;
    window.localStorage.abacusAccessToken = null;
    window.localStorage.abacusUserId = null;
  }

  /* USER METHODS */

  /**
   * Fetches a list of all identity verifications performed on the user.
   * @returns {Object} A map of verification type to status.
   */
  async fetchUserVerifications() {
    if (!this._authUserId)
      throw AbacusError(
        "Cannot fetch user verifications without being logged in."
      );

    return await this.fetchVerifications({
      userId: this._authUserId
    });
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
  async writeUserAnnotations(data: AbacusAnnotations) {
    if (!this._authUserId)
      throw AbacusError(
        "Cannot write user annotations without being logged in."
      );

    return await this.writeAnnotations({
      entityId: toUserId(this._authUserId),
      annotations: data
    });
  }

  /**
   * Fetches a list of all annotations on the user.
   */
  async fetchUserAnnotations() {
    if (!this._authUserId)
      throw AbacusError(
        "Cannot fetch user annotations without being logged in."
      );

    return this.fetchAnnotations({
      entityId: toUserId(this._authUserId)
    });
  }
}

export default BrowserSDK;
