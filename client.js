const fetch = require("cross-fetch");

function AbacusError(message, name) {
  var instance = new Error('Abacus Err:' + message);
  instance.name = name || instance.name;
  return instance;
}

function Abacus(params) {
  if (!params.applicationId) throw new AbacusError('Please provide an application ID');
  this._opts = {
    portalURL: params.portalURL || "https://portal.abacusprotocol.com",
    apiURL: params.apiURL || "https://backend.abacusprotocol.com",
    applicationId: params.applicationId
  };
  this.MODAL_ID = "abacusSDK";
  this._displaying = false;
  this._exists = false;
}

/* AUTHENTICATION METHODS */

Abacus.prototype.closeModal = function (onClose) {
  if (!this._displaying) return;
  modal.style.display = "none";
  this._displaying = false;
  onClose();
}

Abacus.prototype.authorizeWithModal = function (options) {
  OPTS = {
    onOpen: typeof options.onOpen === 'function' ? options.onOpen : function () {},
    onClose: typeof options.onClose === 'function' ? options.onClose : function () {},
  };

  var modal = document.getElementById(this.MODAL_ID);
  if (!modal) {
    modal = document.createElement("iframe");
    modal.src =
      (this._opts.portalURL || "http://localhost:3000") +
      "/modal/login" +
      (this._opts.application ? "?application=" + this._opts.application : "");
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
    window.addEventListener("click", function (event) {
      if (event.target != modal && this._displaying) {
        this.closeModal(OPTS.onClose);
      }
    });
    window.addEventListener("message", function (event) {
      // TODO: deprecated this
      if (event.data === "abacus_modal_close") {
        this.closeModal(OPTS.onClose);
      }
      if (event.data.name !== "abacus") return;
      if (event.data.payload === 'modal_close') {
        this.closeModal(OPTS.onClose());
      }
    });
  }

  // weird hack for ensuring event listener doesn't fire
  setTimeout(function () {
    this._displaying = true;
  }, 1);
  this._exists = true;
}

Abacus.prototype.readAuthToken = function () {

}
Abacus.prototype.deauthorize = function () {}

/* USER METHODS */

Abacus.prototype.fetchVerificationStatus = function (address) {
  return fetch(
    this._opts.apiURL + "/identity/verification_status?address=" + address
  ).then(function (response) {
    return response.json();
  });
}

module.exports = Abacus;