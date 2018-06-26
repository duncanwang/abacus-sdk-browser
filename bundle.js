(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (factory());
}(this, (function () { 'use strict';

  var fetch = require("cross-fetch");

  function AbacusError(message, name) {
    var instance = new Error('Abacus Err:' + message);
    instance.name = name || instance.name;
    return instance;
  }

  function Abacus(params) {
    if (!params.applicationId) throw new AbacusError('Please provide an application ID');
    this._opts = {
      portalURL: params.portalURL || "https://identity.abacusprotocol.com",
      apiURL: params.apiURL || "https://api.abacusprotocol.com",
      applicationId: params.applicationId,
      requireKYC: !!params.requireKYC || false
    };
    this.MODAL_ID = "abacusSDK";
    this._displaying = false;
    this._exists = false;
    this._authUser = window.localStorage.abacusUserToken;
  }

  /* AUTHENTICATION METHODS */

  var closeModal = function (displaying, modal, onClose) {
    if (!_displaying) return;
    modal.style.display = "none";
    _displaying = false;
    onClose();
  };

  Abacus.prototype.authorizeWithModal= function (options) {
    var OPTS = {
      onOpen: options && typeof options.onOpen === 'function' ? options.onOpen : function () {},
      onClose: options && typeof options.onClose === 'function' ? options.onClose : function () {},
    };

    var modal = document.getElementById(this.MODAL_ID);
    if (!modal) {
      modal = document.createElement("iframe");
      modal.src =
        (this._opts.portalURL || "http://localhost:3000") +
        "/modal/login?" +
        (this._opts.applicationId ? "application=" + this._opts.applicationId + "&" : "") +
        (this._opts.requireKYC ? 'requireKYC=true&' : '');
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
          closeModal(this._displaying, modal, OPTS.onClose);
        }
      });
      window.addEventListener("message", function (event) {
        // TODO: deprecated this part
        if (event.data === "abacus_modal_close") {
          closeModal(this._displaying, modal, OPTS.onClose);
        }
        if (event.data.name !== "abacus") return;
        if (event.data.payload === 'modal_close') {
          closeModal(this._displaying, modal, OPTS.onClose);
        }
        if (event.data.payload.appToken) {
          this._authUser = event.data.payload.appToken;
          window.localStorage.abacusUserToken = this._authUser;
        }
      });
    }

    // weird hack for ensuring event listener doesn't fire
    setTimeout(function () {
      this._displaying = true;
    }, 1);
    this._exists = true;
  };

  Abacus.prototype.parseToken = function (token) {
    if (typeof token !== "string") return null;
    return JSON.parse(atob(token.split(".")[1]));
  };

  Abacus.prototype.readAuthToken = function () {
    return this.parseToken(this._authUser);
  };
  Abacus.prototype.deauthorize = function () {
    window.localStorage.abacusUserToken = null;
  };

  /* USER METHODS */

  Abacus.prototype.fetchVerificationStatus = function () {
    return fetch(
      this._opts.apiURL + "/identity/verification_status?address=" + address
    ).then(function (response) {
      return response.json();
    });
  };

  /* ANNOTATION METHODS */

  Abacus.prototype.setUserAnnotations = function (data) {
    var user = this.readAuthToken();
    return fetch(
      this._opts.apiURL + "/api/v1/applications/" + user.applicationId + "/users/" + user.userId + "/annotations",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "Authorization": "bearer " + this._authUser
        },
        body: JSON.stringify(data)
      }
    ).then(function (response) {
      return response.json();
    });
  };

  Abacus.prototype.getUserAnnotations = function () {
    var user = this.readAuthToken();
    return fetch(
      this._opts.apiURL + "/api/v1/applications/" + user.applicationId + "/users/" + user.userId + "/annotations",
      {
        headers: {
          "Authorization": "bearer " + this._authUser
        }
      }
    ).then(function (response) {
      return response.json();
    });
  };

  Abacus.prototype.setTokenAnnotations = function ({address, tokenId, data}) {
    return fetch(
      this._opts.apiURL + "/api/v1/applications/" + this._opts.applicationId + "/tokens/" + address + "/" + tokenId + "/annotations",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "Authorization": "bearer " + this._authUser
        },
        body: JSON.stringify(data)
      }
    ).then(function (response) {
      return response.json();
    });
  };

  Abacus.prototype.getTokenAnnotations = function ({address, tokenId}) {
    return fetch(
      this._opts.apiURL + "/api/v1/applications/" + this._opts.applicationId + "/tokens/" + address + "/" + tokenId + "/annotations",
      {
        headers: {
          "Authorization": "bearer " + this._authUser
        }
      }
    ).then(function (response) {
      return response.json();
    });
  };

  /* Fetch NFT Annotations */


  module.exports = Abacus;

})));
