import { stylesheet } from "./theme/mainButton.js";

export default class MainButton extends HTMLElement
{
    constructor()
    {
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.adoptedStyleSheets = [stylesheet];
    }
    
    connectedCallback()
    {
        const button = document.createElement("button");

        button.className = "home-buttons discover-btn";
        button.textContent = this.getAttribute("name");
        this.shadowRoot.appendChild( button );
    }
}
customElements.define('main-button', MainButton);
