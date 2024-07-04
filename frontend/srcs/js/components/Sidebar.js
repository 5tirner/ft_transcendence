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

        const arr = sidebarComp.querySelectorAll("a");
        arr.forEach(elem => {
            elem.addEventListener("click", (e) => {
                e.preventDefault();
                const href = e.currentTarget.getAttribute("href");
                global.router.navigateTo(href, "root");
            });
        });
        this.shadowRoot.appendChild( sidebarComp );
    }
}
if (!customElements.get('side-bar-comp')) {
    customElements.define("side-bar-comp", Sidebar);
}