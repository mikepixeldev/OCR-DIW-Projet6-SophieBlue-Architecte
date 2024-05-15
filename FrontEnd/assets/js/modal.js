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
    .querySelector(".js-modal-close")
    .removeEventListener("click", closeModal);
  modal.removeEventListener("click", closeModal);
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

// Fonction pour ouvrir la modale d'ajout de travail
function openAddWorkModal() {
  const modalAddWork = document.getElementById("modalAddWork");
  document.getElementById("modalGallery").style.display = "none"; // Cache la modale principale
  modal = modalAddWork; // Modifie la référence de la modale active
  modalAddWork.style.display = "flex"; // Affiche la modale
  modalAddWork.setAttribute("aria-hidden", "false"); // Accessibilité : rend la modale visible aux technologies d'assistance
  modalAddWork.setAttribute("aria-modal", "true"); // Indique que c'est une modale
}

// Fonction pour revenir à la galerie principale depuis la modale d'ajout
function backToGalleryModal() {
  const modalAddWork = document.getElementById("modalAddWork");
  modalAddWork.style.display = "none"; // Cache la modale d'ajout
  const modalGallery = document.getElementById("modalGallery");
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

/////////////////////////// MODAL CONTENT //////////////////////////

// Fonction asynchrone pour afficher les travaux dans une modale
async function displayWorksInModal() {
  // Appelle la fonction getWorks pour obtenir les travaux depuis l'API ou le cache
  const works = await getWorks();

  // Sélectionne l'élément du DOM pour le contenu de la modale
  const modalContent = document.querySelector(".modal-content");
  // Vide le contenu précédent pour éviter les duplications lors de l'affichage
  modalContent.innerHTML = "";

  // Boucle sur chaque travail récupéré pour l'afficher dans la modale
  works.forEach((work) => {
    // Vérifie si un élément pour ce travail existe déjà pour éviter de le créer à nouveau
    let workElement = document.getElementById(`work-${work.id}`);
    if (!workElement) {
      // Crée un élément figure pour chaque travail si non existant
      const figureElement = document.createElement("figure");
      figureElement.classList.add("image-container");
      figureElement.id = `work-${work.id}`;

      // Crée un élément image, configure son source et le texte alternatif
      const imgElement = document.createElement("img");
      imgElement.src = work.imageUrl;
      imgElement.alt = work.title;

      // Prépare l'icône de suppression et son conteneur
      const spanElement = document.createElement("span");
      spanElement.classList.add("icon-background");
      // Crée une icône de suppression et y attache un gestionnaire d'événements
      const iconElement = document.createElement("i");
      iconElement.classList.add("fa-solid", "fa-trash-can", "icon-overlay");
      iconElement.addEventListener("click", function (event) {
        event.preventDefault(); // Empêche le rechargement de la page
        deleteWork(work.id); // Supprime le travail lors du clic
      });

      // Assemble et ajoute les éléments à la modale
      spanElement.appendChild(iconElement);
      figureElement.appendChild(imgElement);
      figureElement.appendChild(spanElement);
      modalContent.appendChild(figureElement);
    }
  });
}

////////////////////// FONCTION DELETE //////////////////////

// Fonction asynchrone pour supprimer un travail par son identifiant
async function deleteWork(workId) {
  try {
    // Envoie une requête DELETE à l'API pour supprimer le travail spécifié
    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`, // Utilise le token stocké pour l'authentification
      },
    });

    // Si la réponse n'est pas OK, lance une exception
    if (!response.ok) throw new Error("Failed to delete work"); // Gère les réponses non réussies
    globalWorks = null; // Réinitialise le cache des travaux
    displayWorksInModal(); // Met à jour l'affichage sans rechargement de la page
    displayFilteredWorks(); // Rafraîchit l'affichage des travaux
  } catch (error) {
    console.error("Erreur lors de la suppression:", error); // Log en cas d'erreur
  }
}

// Rafraîchit l'affichage des travaux quand nécessaire
document
  .getElementById("edit-works")
  .addEventListener("click", displayWorksInModal);

/////////////////////// FONCTIONS POUR LE FORMULAIRE D'AJOUT DES TRAVAUX //////////////////////////

// Soumet les données du formulaire pour créer un nouveau travail
async function submitAddWorkForm() {
  const form = document.getElementById("formAddWork");
  const submitButton = form.querySelector("button[type='submit']"); // Confirme le sélecteur du bouton

  form.addEventListener("submit", async function (event) {
    event.preventDefault(); // Empêche le rechargement de la page lors de la soumission
    submitButton.disabled = true; // Désactive le bouton dès que le formulaire est soumis pour éviter les soumissions multiples

    const formData = new FormData(form);

    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`, // Authentification avec le token
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Success:", result);
      filterWorks(0); // Rafraîchit l'affichage des travaux
      closeModal(event); // Ferme la modale après la soumission réussie
    } catch (error) {
      console.error("Error:", error);
      submitButton.disabled = false; // Réactive le bouton en cas d'erreur pour permettre une nouvelle tentative
    } finally {
      globalWorks = null; // Réinitialise le cache après la soumission pour s'assurer que les données sont à jour
      submitButton.disabled = false; // Réactive le bouton après la soumission
    }
  });
}

// Charge les catégories depuis l'API et les ajoute au sélecteur de catégories dans le formulaire
async function loadCategories() {
  const categorySelect = document.getElementById("categoryInput");
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();

    const defaultOption = document.createElement("option");
    defaultOption.textContent = "Choisissez une catégorie"; // Option par défaut
    defaultOption.value = "";
    categorySelect.appendChild(defaultOption);

    categorySelect.value = ""; // Sélectionne l'option par défaut initialement

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      categorySelect.appendChild(option); // Ajoute chaque catégorie au sélecteur
    });
  } catch (error) {
    console.error("Erreur lors du chargement des catégories:", error);
  }
}

// Gère la soumission du formulaire en postant les données
function setupFormSubmission() {
  const formAddWork = document.getElementById("formAddWork");
  formAddWork.addEventListener("submit", async (event) => {
    event.preventDefault(); // Empêche le rechargement de la page lors de la soumission
    const formData = new FormData(formAddWork);

    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`, // Authentification avec le token
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      displayWorksInModal(); // Met à jour l'affichage des travaux
      filterWorks(0); // Rafraîchit l'affichage des travaux
      console.log("Projet ajouté avec succès:", result);
      closeModal(event); // Ferme la modale après la soumission
    } catch (error) {
      console.error("Erreur lors de l'ajout du projet:", error);
    }
  });
}

// Prévisualise l'image chargée avant l'envoi
document.getElementById("file").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const previewImage = document.getElementById("previewImage");
      previewImage.src = e.target.result;
      previewImage.style.display = "block"; // Affiche l'aperçu de l'image

      // Cache les éléments initiaux pour faire place à l'aperçu
      document.querySelector(".containerAddPhoto i").style.display = "none";
      document.querySelector(".containerAddPhoto label").style.display = "none";
      document.querySelector(".containerAddPhoto p").style.display = "none";
    };
    reader.readAsDataURL(file);
  }
});

// Vérifie l'état du bouton de soumission en fonction de la complétude du formulaire
document.addEventListener("DOMContentLoaded", () => {
  const titleInput = document.getElementById("title");
  const categorySelect = document.getElementById("categoryInput");
  const fileInput = document.getElementById("file");
  const addWorkButton = document.getElementById("addWorkButton");

  function updateButtonState() {
    if (
      titleInput.value.trim() !== "" &&
      categorySelect.value &&
      fileInput.files.length > 0
    ) {
      addWorkButton.disabled = false; // Active le bouton si toutes les conditions sont remplies
      addWorkButton.style.backgroundColor = "#1d6154";
      addWorkButton.style.color = "white";
    } else {
      addWorkButton.disabled = true; // Désactive le bouton si une condition n'est pas remplie
      addWorkButton.style.backgroundColor = "#a7a7a7";
      addWorkButton.style.color = "white";
    }
  }

  titleInput.addEventListener("input", updateButtonState);
  categorySelect.addEventListener("change", updateButtonState);
  fileInput.addEventListener("change", updateButtonState);

  // Initial check on load
  updateButtonState();
});

// Réinitialise les écouteurs d'événements pour les boutons de la modale pour éviter les doubles écoutes
function setupModalButtons() {
  const addPhotoButton = document.getElementById("addPhotoButton");
  addPhotoButton.removeEventListener("click", openAddWorkModal);
  addPhotoButton.addEventListener("click", openAddWorkModal);

  const backButton = document.querySelector(".js-modal-back");
  backButton.removeEventListener("click", backToGalleryModal);
  backButton.addEventListener("click", backToGalleryModal);
}

// Ferme la modale d'ajout de travail
function setupCloseButtonForAddWorkModal() {
  const closeButton = document.querySelector(".js-modal-close");
  closeButton.addEventListener("click", closeModal);
}

function setupBackgroundClickForAddWorkModal() {
  const modal = document.querySelector(".modal");
  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });
}

// S'assure que les boutons sont configurés dès que le DOM est chargé
document.addEventListener("DOMContentLoaded", function () {
  setupModalButtons(); // Configure déjà les boutons pour les autres modales
  setupCloseButtonForAddWorkModal(); // Configure le bouton de fermeture pour modalAddWork
  setupBackgroundClickForAddWorkModal(); // Configure la fermeture en cliquant à l'extérieur pour modalAddWork
});

// Initialise les fonctions au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  loadCategories(); // Charge les catégories disponibles
  setupFormSubmission(); // Configure la soumission du formulaire
});
