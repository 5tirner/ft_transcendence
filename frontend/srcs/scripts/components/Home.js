export function renderHome() {
  document.querySelector("#nav_bar").style.display = "block";
  const homeElement = document.querySelector("#home");
  homeElement.style.display = "block";
  const content = document.createElement("p");
  content.textContent = "this is home page";
  homeElement.appendChild(content);
}
