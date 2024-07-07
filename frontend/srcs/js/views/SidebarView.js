import { stylesheet } from "../theme/sidebarTheme.js";

export default class Sidebar extends HTMLElement
{
    constructor()
    {
        super();
    }
    
    connectedCallback()
    {
        const template = document.getElementById("side-bar");
        const sidebarComp = template.content.cloneNode(true);

        const style = document.createElement("style");
        style.textContent = stylesheet;
        this.appendChild(style);

        const arr = sidebarComp.querySelectorAll("a");
        arr.forEach(elem => {
            elem.addEventListener("click", (e) => {
                e.preventDefault();
                const href = e.currentTarget.getAttribute("href");
                if ( href === "/" )
                {
                    // TODO: handle the logout logic
                    Auth.logout();
                    
                }
                global.router.navigateTo(href, "root");
            });
        });
        this.appendChild( sidebarComp );
    }
}
if (!customElements.get('side-bar-comp')) {
    customElements.define("side-bar-comp", Sidebar);
}