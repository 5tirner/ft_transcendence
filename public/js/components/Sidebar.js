import { stylesheet } from "./theme/sidebarTheme.js";

export default class Sidebar extends HTMLElement
{
    constructor()
    {
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.adoptedStyleSheets = [stylesheet];
    }
    
    connectedCallback()
    {
        const template = document.getElementById("side-bar");
        const sidebarComp = template.content.cloneNode(true);
        this.shadowRoot.appendChild( sidebarComp );
    }
}