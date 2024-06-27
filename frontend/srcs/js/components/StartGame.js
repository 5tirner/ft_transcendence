import { stylesheet } from "./theme/startGameTheme.js";

export default class StartGame extends HTMLElement
{
    constructor()
    {
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.adoptedStyleSheets = [stylesheet];
    }
    
    connectedCallback()
    {
        const template = document.getElementById("start-game");
        const startGameComp = template.content.cloneNode(true);
        this.shadowRoot.appendChild( startGameComp );
    }
}
// customElements.define('start-game-comp', StartGame);