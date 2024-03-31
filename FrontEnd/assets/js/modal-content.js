// Affichage de la galerie des travaux

async function displayWorksInModal() {
  // Utilise getWorks pour récupérer les travaux
  const works = await getWorks();

  // Sélectionne le div avec la classe .modal-content pour y ajouter les éléments
  const modalContent = document.querySelector(".modal-content");
  modalContent.innerHTML = ""; // Nettoyer le contenu existant

  works.forEach((work) => {
    // Crée un élément figure pour chaque travail
    const figureElement = document.createElement("figure");
    // Ajoute la classe image-container à l'élément figure
    figureElement.classList.add("image-container");

    // Crée et configure l'élément img
    const imgElement = document.createElement("img");
    // Ajoute le lien vers la source de l'image et l'attribut alt
    imgElement.src = work.imageUrl;
    imgElement.alt = work.title;

    // Crée un conteneur pour l'icône de suppression
    const spanElement = document.createElement("span");
    // Ajoute la classe icon-background à l'élément span
    spanElement.classList.add("icon-background");

    // Crée l'icône trash pour la suppression
    const iconElement = document.createElement("i");
    // Ajoute les classes nécessaires à l'icône trash de Font Awesome
    iconElement.classList.add("fa-solid", "fa-trash-can", "icon-overlay");
    // Ajoute un écouteur d'événements pour la suppression du travail - pas fini
    iconElement.addEventListener("click", () => deleteWork(work.id));

    // Assemble les éléments de l'intérieur vers l'extérieur
    spanElement.appendChild(iconElement);
    figureElement.appendChild(imgElement);
    figureElement.appendChild(spanElement);

    // Ajoute le figure à la modale
    modalContent.appendChild(figureElement);
  });
}

// Cette fonction effectue une action de suppression d'un travail
async function deleteWork(workId) {
  // Implémentation de la logique de suppression (à compléter)
  console.log(`Suppression du travail avec l'ID ${workId}...`);
}

// Ajoute un écouteur pour lancer la fonction displayWorksInModal et afficher la galerie. Sinon, il ne se passerait rien
document
  .getElementById("edit-works")
  .addEventListener("click", displayWorksInModal);
