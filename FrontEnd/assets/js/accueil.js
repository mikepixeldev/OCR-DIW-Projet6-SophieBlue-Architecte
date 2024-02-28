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
  for (let work of works) {
    const figureElement = document.createElement("figure");
    const figcaptionElement = document.createElement("figcaption");
    const imgElement = document.createElement("img");
    imgElement.src = work.imageUrl;
    figcaptionElement.innerText = work.title;
    figureElement.appendChild(imgElement);
    figureElement.appendChild(figcaptionElement);
    galleryElement.appendChild(figureElement);
  }
}
displayWorks();
