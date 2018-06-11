var abacusSSOModalId = "abacusSSO";
var displaying = false;
var exists = false;

module.exports = function openModal(opts) {
  opts = opts || {};

  var modal = document.getElementById(abacusSSOModalId);
  if (!modal) {
    var iframe = document.createElement("iframe");
    iframe.src =
      (opts.baseURL || "http://localhost:3000") + "/offerings/modal/login";
    iframe.width = "100%";
    iframe.height = "100%";
    iframe.frameBorder = "0";

    var modalContent = document.createElement("div");
    modalContent.style.backgroundColor = "#fefefe";
    modalContent.style.margin = "50px auto";
    modalContent.style.height = "700px";
    modalContent.style.width = "600px";
    modalContent.style.border = "1px solid #888";
    modalContent.appendChild(iframe);

    modal = document.createElement("div");
    modal.id = abacusSSOModalId;
    modal.style.position = "fixed";
    modal.style.zIndex = "1";
    modal.style.left = "0";
    modal.style.top = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.overflow = "auto";
    modal.style.backgroundColor = "rgb(0, 0, 0, 0.4)";
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
  }
  modal.style.display = "block";

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
        console.log("removing.");
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
