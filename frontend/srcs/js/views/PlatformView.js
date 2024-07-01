import Sidebar from "./SidebarView.js"
import { gameModeImg } from "../assets/srcs.js";

import { loadStartGameAndPlayerRankComponents } from "../assets/startGameAndPlayerRank.js"
import { loadUserProfileView } from "../assets/loadUserProfileView.js"
import { loadGameView } from "../assets/loadGameView.js"

import { stylesheet } from "../theme/platformTheme.js"
import { loadProfileSettings } from "../assets/loadProfileSettings.js";

export default class Platform extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const style = document.createElement("style");
    const template = document.getElementById("platform-page");
    const templateContent = template.content.cloneNode(true);

    style.textContent = stylesheet;
    this.appendChild(style);
    this.setAttribute("id", "platform");
    this.appendChild(templateContent);

    const middleSection = this.querySelector("#middle");
    
    
    switch (window.location.pathname)
    {
      case "/platform":
        loadStartGameAndPlayerRankComponents(middleSection);
        break;
      case "/profile":
        loadUserProfileView(middleSection);
        break;
      case "/game":
        loadGameView(middleSection, gameModeImg);
        break;
      case "/setting":
        loadProfileSettings(middleSection);
        break;
      default:
        break;
    }
  }
}
customElements.define("platform-page", Platform);
