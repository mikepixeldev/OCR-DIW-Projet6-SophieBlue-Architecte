//////////////////////////////////// MODAL ////////////////////////////////////

// Déclaration de variables pour la gestion des modales
let modal = null;
const focusableSelector = "button, a, input, textarea"; // Sélecteurs pour éléments focusables dans la modale
let focusables = [];
let lastFocusedElement = null;

// Flag pour vérifier si la configuration initiale de la modale a été effectuée
let isModalSetup = false;

// Configure la modale une seule fois pour éviter des configurations multiples
function setupModalOnce() {
  if (!isModalSetup) {
    setupModalButtons(); // Configure les interactions des boutons dans la modale
    document.getElementById("edit-works").addEventListener("click", openModal);
    isModalSetup = true; // Marque la modale comme configurée
  }
}

// Attache la fonction de configuration au chargement du DOM
document.addEventListener("DOMContentLoaded", setupModalOnce);

// Ouvre la modale en réponse à un événement (par exemple, clic)
const openModal = function (e) {
  e.preventDefault(); // Empêche le comportement par défaut de l'événement
  modal = document.getElementById("modalGallery"); // Sélectionne la modale
  if (!modal) return; // Si aucun élément modal n'est trouvé, retourne pour éviter des erreurs
  lastFocusedElement = document.activeElement; // Sauvegarde de l'élément actuellement focusé
  focusables = Array.from(modal.querySelectorAll(focusableSelector)); // Collecte tous les éléments focusables
  if (focusables.length) focusables[0].focus(); // Focus sur le premier élément focusable
  modal.style.display = "flex"; // Affiche la modale
  modal.setAttribute("aria-hidden", "false");
  modal.setAttribute("aria-modal", "true");
  document.addEventListener("keydown", handleKeyDown); // Écouteur pour la gestion du clavier
  modal.querySelector(".js-modal-close").addEventListener("click", closeModal); // Bouton de fermeture
  modal.addEventListener("click", closeModal); // Ferme la modale si on clique en dehors
  modal
    .querySelector(".modal-wrapper")
    .addEventListener("click", stopPropagation); // Empêche la fermeture lors d'un clic à l'intérieur de la modale
};

// Ferme la modale et nettoie les écouteurs d'événements
const closeModal = function (e) {
  console.log("closeModal");
  if (e && e.preventDefault) e.preventDefault(); // Empêche le comportement par défaut lors de la fermeture
  if (!modal) return;

  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  document.removeEventListener("keydown", handleKeyDown);
  modal
    .querySelector(".modal-wrapper")
    .removeEventListener("click", stopPropagation);
  modal = null;
  if (lastFocusedElement) lastFocusedElement.focus(); // Restaure le focus à l'élément précédemment focusé
};

// Empêche la propagation des événements pour les clics à l'intérieur de la modale
const stopPropagation = function (e) {
  e.stopPropagation();
};

// Gère la navigation au clavier dans la modale
const handleKeyDown = function (e) {
  if (!modal) return;
  if (e.key === "Escape") {
    closeModal(e); // Ferme la modale avec la touche 'Escape'
  } else if (e.key === "Tab") {
    let index = focusables.indexOf(document.activeElement); // Trouve l'index de l'élément actuellement focusé
    if (e.shiftKey) {
      // Si 'Shift' est pressé, navigue en arrière
      index--;
    } else {
      // Sinon navigue en avant
      index++;
    }
    if (index >= focusables.length) index = 0; // Boucle au début si on dépasse la fin
    if (index < 0) index = focusables.length - 1; // Boucle à la fin si on revient en arrière au début
    focusables[index].focus(); // Focus sur le nouvel élément
    e.preventDefault(); // Empêche le comportement par défaut de 'Tab'
  }
};

// Vérification pour éviter de configurer la modale plusieurs fois
if (
  !document.getElementById("edit-works").hasAttribute("data-modal-initialized")
) {
  document.getElementById("edit-works").addEventListener("click", openModal);
  document
    .getElementById("edit-works")
    .setAttribute("data-modal-initialized", "true");
}

/////////////////////////// FONCTIONS CHANGEMENT DE MODALES //////////////////////////

function updateModalHandler(modalActive) {
  modal = modalActive; // Modifie la référence de la modale active
  modal.querySelector(".js-modal-close").addEventListener("click", closeModal); // Bouton de fermeture
}

// Fonction pour ouvrir la modale d'ajout de travail
function openAddWorkModal() {
  const modalAddWork = document.getElementById("modalAddWork");
  document.getElementById("modalGallery").style.display = "none"; // Cache la modale principale
  updateModalHandler(modalAddWork);
  modalAddWork.style.display = "flex"; // Affiche la modale
  modalAddWork.setAttribute("aria-hidden", "false"); // Accessibilité : rend la modale visible aux technologies d'assistance
  modalAddWork.setAttribute("aria-modal", "true"); // Indique que c'est une modale
}

// Fonction pour revenir à la galerie principale depuis la modale d'ajout
function backToGalleryModal() {
  const modalAddWork = document.getElementById("modalAddWork");
  modalAddWork.style.display = "none"; // Cache la modale d'ajout
  const modalGallery = document.getElementById("modalGallery");
  updateModalHandler(modalGallery);
  modalGallery.style.display = "flex"; // Affiche la modale principale
}

// Configure les boutons dans les modales pour éviter les écoutes multiples
function setupModalButtons() {
  const addPhotoButton = document.getElementById("addPhotoButton");
  const backButton = document.querySelector(".js-modal-back");

  // Enlève les écouteurs d'événements existants pour prévenir les duplications
  addPhotoButton.removeEventListener("click", openAddWorkModal);
  backButton.removeEventListener("click", backToGalleryModal);

  // Ajoute les nouveaux écouteurs d'événements
  addPhotoButton.addEventListener("click", openAddWorkModal);
  backButton.addEventListener("click", backToGalleryModal);
}

// Initialisation des écouteurs d'événements au chargement de la page
document.addEventListener("DOMContentLoaded", setupModalButtons);
