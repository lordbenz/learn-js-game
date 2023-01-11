const projectList = [
  {
    gameKey: "sprite-sheet-animation",
    name: "Sprite Sheet Animation",
    description: "A simple sprite sheet animation playground.",
  },

  {
    gameKey: "rpg-turn-based-example",
    name: "RPG Turn Based Example",
    description: "A simple RPG turn based game example with world map and battle scene.",
  },
];

function createDivCard(title, description, gameKey) {
  const imageUrl = `assets/${gameKey}.png`;
  const link = `${gameKey}/index.html`;
  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `
        <div class="card-image">
        <img src="${imageUrl}" alt="${title}">
        </div>
        <div class="card-content">
        <h3>${title}</h3>
        <p>${description}</p>
        </div>
        <a class="demo-btn" href="${link}" target="_blank">Demo</a>
    `;
  return card;
}

window.onload = function () {
  const projects = document.getElementById("projects");
    projectList.forEach((project) => {
        projects.appendChild(createDivCard(project.name, project.description, project.gameKey))
    });
};
