import { stylesheet } from "./theme/gameModeTheme.js";

export default class GameMode extends HTMLElement
{
    constructor()
    {
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.adoptedStyleSheets = [stylesheet];
    }
    
    connectedCallback()
    {
        const gameModeTempl = document.getElementById("game-mode-comp");
        const activateTempl = gameModeTempl.content.cloneNode(true);
        this.shadowRoot.appendChild( activateTempl );
    }
}
customElements.define('game-mode', GameMode);