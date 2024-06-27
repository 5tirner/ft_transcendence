import { Router } from "../router.js";
import { stylesheet } from "../theme/loginTheme.js";

export default class Login extends HTMLElement
{
    constructor()
    {
        super();
    }
    
    connectedCallback()
    {
        const style = document.createElement("style");
        const template = document.getElementById("login-page");
        const activate = template.content.cloneNode(true);
        style.textContent = stylesheet;
        this.appendChild( style );
        this.appendChild( activate );

        const google_intra_buttons = this.querySelectorAll("a");
        google_intra_buttons.forEach( elem => {
            elem.addEventListener( "click", (event) => {
                event.preventDefault();
                if ( event.currentTarget.getAttribute("name") === "google" )
                {
                    // * Do something
                    global.router.navigateTo("/platform", "platform-page", true);
                }
                else
                {
                    // * Do something
                    global.router.navigateTo("/platform", "platform-page", true);
                }
            });
        });
    }
}

customElements.define('login-page', Login);