const fetch = require("cross-fetch");

function AbacusError(name, message) {
  var instance = new Error(message);
  instance.name = name;
  return instance;
}

function Abacus(params) {
  this._opts = {
    portalURL: "https://portal.abacusprotocol.com",
    apiURL: "https://backend.abacusprotocol.com"
  };
  this.MODAL_ID = "abacusSDK";
  this._displaying = false;
  this._exists = false;
  if (params.portalURL) this._opts.portalURL = params.portalURL;
  if (params.apiURL) this._opts.apiURL = params.apiURL;
  if (params.application) this._opts.application = params.application;
}

/* AUTHENTICATION METHODS */

Abacus.prototype.authorizeWithModal = function (modalOpts) {
  var OPTS = {
    onOpen: modalOpts.onOpen || () => null,
    onClose: modalOpts.onClose || () => null,
  };
  
  if ()

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
  modal.style.display = "block";

  function removeAbacusModal() {
    if (this._displaying) {
      modal.style.display = "none";
      this._displaying = false;
    }
    if (modalOpts.onClose) {
      modalOpts.onClose();
    }
  }

  if (!this._exists) {
    window.addEventListener("click", function (event) {
      if (event.target != modal && this._displaying) {
        removeAbacusModal();
      }
    });
    window.addEventListener("message", function (event) {
      if (event.data === "abacus_modal_close") {
        removeAbacusModal();
      }
    });
  }

  // weird hack for ensuring event listener doesn't fire
  setTimeout(function () {
    this._displaying = true;
  }, 1);
  this._exists = true;
  return removeAbacusModal;
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