async function getWorks() {
  const works = await fetch("http://localhost:5678/api/works");
  console.log(works);
  const worksJson = await works.json();
  console.log(worksJson);
  return worksJson;
}

async function displayWorks() {
  const works = await getWorks();
  const galleryElement = document.querySelector(".gallery");
  for (let travaux of works) {
    const figureElement = document.createElement("figure");
    const figcaptionElement = document.createElement("figcaption");
    const imgElement = document.createElement("img");
    imgElement.src = travaux.imageUrl;
    figcaptionElement.innerText = travaux.title;
    figureElement.appendChild(imgElement);
    figureElement.appendChild(figcaptionElement);
    galleryElement.appendChild(figureElement);
  }
}
displayWorks();

async function filterWorks(categoryId) {
  const works = await getWorks();
  const filteredWorks = works.filter(
    (travail) => travail.category.id === categoryId
  );
  displayFilteredWorks(filteredWorks);
}

async function displayFilteredWorks(filteredWorks) {
  const galleryElement = document.querySelector(".gallery");
  galleryElement.innerHTML = "";
  for (let travail of filteredWorks) {
    const figureElement = document.createElement("figure");
    const figcaptionElement = document.createElement("figcaption");
    const imgElement = document.createElement("img");
    imgElement.src = travail.imageUrl;
    figcaptionElement.innerText = travail.title;
    figureElement.appendChild(imgElement);
    figureElement.appendChild(figcaptionElement);
    galleryElement.appendChild(figureElement);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const works = await getWorks();
  const categories = new Set(works.map((travail) => travail.category));
  const filterContainerElement = document.querySelector("#filter-container");

  categories.forEach((category) => {
    const checkboxElement = document.createElement("input");
    checkboxElement.type = "checkbox";
    checkboxElement.id = category;
    checkboxElement.name = category;
    checkboxElement.value = category;

    const labelElement = document.createElement("label");
    labelElement.htmlFor = category;
    labelElement.appendChild(document.createTextNode(category));

    filterContainerElement.appendChild(checkboxElement);
    filterContainerElement.appendChild(labelElement);

    checkboxElement.addEventListener("change", () => {
      const selectedcategories = Array.from(
        filterContainerElement.querySelectorAll(
          'input[type="checkbox"]:checked'
        )
      ).map((checkbox) => checkbox.value);
      const filteredWorks = works.filter((travail) =>
        selectedcategories.includes(travail.category.name)
      );
      displayFilteredWorks(filteredWorks);
    });
  });
  displayFilteredWorks(works);
});
