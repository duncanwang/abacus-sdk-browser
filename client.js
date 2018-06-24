const fetch = require("cross-fetch");

var abacusSDKModalId = "abacusSDK";
var displaying = false;
var exists = false;
var opts = {
  portalURL: "https://portal.abacusprotocol.com",
  apiURL: "https://backend.abacusprotocol.com"
};

function init(params) {
  if (params.portalURL) opts.portalURL = params.portalURL;
  if (params.apiURL) opts.apiURL = params.apiURL;
  if (params.application) opts.application = params.application;
}

function fetchVerificationStatus(address) {
  return fetch(
    opts.apiURL + "/identity/verification_status?address=" + address
  ).then(function(response) {
    return response.json();
  });
}

function openModal(modalOpts) {
  modalOpts = modalOpts || {};

  var modal = document.getElementById(abacusSDKModalId);
  if (!modal) {
    modal = document.createElement("iframe");
    modal.src =
      (opts.portalURL || "http://localhost:3000") +
      "/modal/login" +
      (opts.application ? "?application=" + opts.application : "");
    modal.width = "100%";
    modal.height = "100%";
    modal.frameBorder = "0";
    modal.style.position = "fixed";
    modal.style.zIndex = "1337";
    modal.id = abacusSDKModalId;
    modal.style.left = "0";
    modal.style.top = "0";
    modal.style.overflow = "hidden";
    document.body.appendChild(modal);
  }
  modal.style.display = "block";

  function removeAbacusModal() {
    if (displaying) {
      modal.style.display = "none";
      displaying = false;
    }
    if (modalOpts.onClose) {
      modalOpts.onClose();
    }
  }

  if (!exists) {
    window.addEventListener("click", function(event) {
      if (event.target != modal && displaying) {
        removeAbacusModal();
      }
    });
    window.addEventListener("message", function(event) {
      if (event.data === "abacus_modal_close") {
        removeAbacusModal();
      }
    });
  }

  // weird hack for ensuring event listener doesn't fire
  setTimeout(function() {
    displaying = true;
  }, 1);
  exists = true;
  return removeAbacusModal;
}

module.exports = {
  init: init,
  fetchVerificationStatus: fetchVerificationStatus,
  openModal: openModal
};
