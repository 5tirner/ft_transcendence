import { stylesheet } from "./theme/topPlayersTheme.js";

export default class TopPlayers extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [stylesheet];
  }

  connectedCallback() {
    const template = document.getElementById("player-rank-component");
    const playerRank = template.content.cloneNode(true);
    this.shadowRoot.appendChild(playerRank);
  }
}