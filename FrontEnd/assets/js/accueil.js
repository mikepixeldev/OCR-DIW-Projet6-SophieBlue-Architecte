async function getWorks() {
  const works = await fetch("http://localhost:5678/api/works");
  console.log(works);
  const worksJson = await works.json();
  console.log(worksJson);
  return worksJson;
}

/*async function displayWorks() {
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
}*/

async function getCategories() {
  const categories = await fetch("http://localhost:5678/api/categories");
  console.log(categories);
  const categoriesJson = await categories.json();
  console.log(categoriesJson);
  return categoriesJson;
}

async function displayCategories() {
  const categories = await getCategories();
  categories.unshift({ id: 0, name: "Tous" });
  const filtersContainer = document.querySelector("#filter-container");
  for (let cat of categories) {
    const filterElement = document.createElement("div");
    filterElement.classList.add("filter-item");
    filterElement.innerText = cat.name;
    filterElement.addEventListener("click", () => {
      filterWorks(cat.id);
    });
    filtersContainer.appendChild(filterElement);
  }
}

async function filterWorks(categoryId) {
  const works = await getWorks();
  if (categoryId === 0) {
    displayFilteredWorks(works);
    return;
  }
  const filteredWorks = works.filter(
    (travail) => travail.category.id === categoryId
  );
  displayFilteredWorks(filteredWorks);
}

async function displayFilteredWorks(filteredWorks = null) {
  const galleryElement = document.querySelector(".gallery");
  if (filteredWorks == null) {
    filteredWorks = await getWorks();
  }
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
function isConnected() {
  return sessionStorage.getItem("token") !== null;
}
function handleLoginButton() {
  const loginButton = document.querySelector("#login-button");
  console.log(loginButton);
  if (isConnected()) {
    loginButton.innerText = "logout";
    loginButton.addEventListener("click", () => {
      sessionStorage.removeItem("token");
      window.location.href = "./index.html";
    });
  } else {
    loginButton.innerText = "login";

    loginButton.addEventListener("click", () => {
      window.location.href = "./login.html";
    });
  }
}

function handleAdminElements() {
  const adminElements = document.querySelectorAll(".admin-element");
  console.log(isConnected());
  if (isConnected()) {
    adminElements.forEach((element) => {
      element.classList.remove("hidden");
    });
  } else {
    adminElements.forEach((element) => {
      element.classList.add("hidden");
    });
  }
}

function handleModal() {}

(function main() {
  handleLoginButton();
  displayFilteredWorks();
  displayCategories();
  handleAdminElements();
})();
