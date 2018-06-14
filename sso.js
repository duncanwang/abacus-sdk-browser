var abacusSSOModalId = "abacusSSO";
var displaying = false;
var exists = false;

module.exports = function openModal(opts) {
  opts = opts || {};

  var modal = document.getElementById(abacusSSOModalId);
  if (!modal) {
    modal = document.createElement("iframe");
    modal.src =
      (opts.baseURL || "http://localhost:3000") +
      "/modal/login" +
      (opts.application ? "?application=" + opts.application : "");
    modal.width = "100%";
    modal.height = "100%";
    modal.frameBorder = "0";
    modal.style.position = "fixed";
    modal.style.zIndex = "1337";
    modal.id = abacusSSOModalId;
    modal.style.left = "0";
    modal.style.top = "0";
    modal.style.overflow = "hidden";
    document.body.appendChild(modal);
  }

  function removeAbacusModal() {
    if (displaying) {
      modal.style.display = "none";
      displaying = false;
    }
    if (opts.onClose) {
      opts.onClose();
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
};
