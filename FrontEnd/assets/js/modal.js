let modal = null;
const focusableSelector = "button, a, input, textarea";
let focusables = [];
let lastFocusedElement = null;

const openModal = function (e) {
  e.preventDefault();
  modal = document.getElementById("modal");
  lastFocusedElement = document.activeElement;
  focusables = Array.from(modal.querySelectorAll(focusableSelector));
  if (focusables.length) focusables[0].focus();
  modal.style.display = "flex";
  modal.setAttribute("aria-hidden", "false");
  modal.setAttribute("aria-modal", "true");
  document.addEventListener("keydown", handleKeyDown);
  modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
  modal.addEventListener("click", closeModal);
  modal
    .querySelector(".modal-wrapper")
    .addEventListener("click", stopPropagation);
};

const closeModal = function (e) {
  if (modal === null) return;
  e.preventDefault();
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  document.removeEventListener("keydown", handleKeyDown);
  modal
    .querySelector(".js-modal-close")
    .removeEventListener("click", closeModal);
  modal.removeEventListener("click", closeModal);
  modal
    .querySelector(".modal-wrapper")
    .removeEventListener("click", stopPropagation);
  modal = null;
  lastFocusedElement.focus();
};

const stopPropagation = function (e) {
  e.stopPropagation();
};

const handleKeyDown = function (e) {
  if (e.key === "Escape") {
    closeModal(e);
  } else if (e.key === "Tab" && modal != null) {
    let index = focusables.indexOf(document.activeElement);
    if (e.shiftKey) {
      index--;
    } else {
      index++;
    }
    if (index >= focusables.length) index = 0;
    if (index < 0) index = focusables.length - 1;
    focusables[index].focus();
    e.preventDefault();
  }
};

document.getElementById("edit-works").addEventListener("click", openModal);
