import { stylesheet } from "../theme/homeTheme.js";
import MainButton from "../components/MainButton.js";

export default class Home extends HTMLElement {
  constructor()
  {
    super();
  }
  
  connectedCallback()
  {
    const style = document.createElement("style");
    const template = document.getElementById("home-page");
    const templateContent = template.content.cloneNode(true);
    
    style.textContent = stylesheet;
    this.appendChild(style);
    this.appendChild(templateContent);

    const links = this.querySelectorAll("a");
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const href = e.target.getAttribute("href");
        global.router.navigateTo(href, "root", true);
      });
    });
  }
}

customElements.define("home-page", Home);
