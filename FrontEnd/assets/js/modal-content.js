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
    await displayWorksInModal(); // Met à jour l'affichage sans rechargement de la page
    await displayFilteredWorks(); // Rafraîchit l'affichage des travaux
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
      globalWorks = null; // Réinitialise le cache après ajout pour garantir que les données sont à jour
      await filterWorks(0); // Rafraîchit l'affichage des travaux dans la modale
      await displayFilteredWorks(); // Rafraîchit l'affichage des travaux dans la galerie principale
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
      await displayWorksInModal(); // Met à jour l'affichage des travaux dans la modale
      await filterWorks(0); // Rafraîchit l'affichage des travaux dans la modale
      await displayFilteredWorks(); // Rafraîchit l'affichage des travaux dans la galerie principale
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

  // Fonction pour mettre à jour l'état du bouton de soumission
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

  // Ajoute des écouteurs d'événements pour mettre à jour l'état du bouton lors des changements
  titleInput.addEventListener("input", updateButtonState);
  categorySelect.addEventListener("change", updateButtonState);
  fileInput.addEventListener("change", updateButtonState);

  // Vérification initiale de l'état du bouton lors du chargement
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

// Configure la fermeture en cliquant à l'extérieur pour toutes les modales
function setupBackgroundClickForAddWorkModal() {
  const modals = document.querySelectorAll(".modal");

  modals.forEach((element) => {
    element.addEventListener("click", function (event) {
      if (event.target === element) {
        closeModal();
      }
    });
  });
}

// S'assure que les boutons sont configurés dès que le DOM est chargé
document.addEventListener("DOMContentLoaded", async function () {
  setupModalButtons(); // Configure déjà les boutons pour les autres modales
  setupCloseButtonForAddWorkModal(); // Configure le bouton de fermeture pour modalAddWork
  setupBackgroundClickForAddWorkModal(); // Configure la fermeture en cliquant à l'extérieur pour modalAddWork
  await loadCategories(); // Charge les catégories disponibles
  setupFormSubmission(); // Configure la soumission du formulaire
});
