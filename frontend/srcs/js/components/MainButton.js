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
        const attrb = this.getAttribute("class");
        button.className = attrb;
        button.textContent = this.getAttribute("name");
        this.shadowRoot.appendChild( button );
    }
}
if ( !customElements.get('main-button') )
    customElements.define('main-button', MainButton);
