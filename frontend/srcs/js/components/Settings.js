import MainButton from "./MainButton.js";
import { stylesheet } from "./theme/settingTheme.js"

export default class ProfileSetting extends HTMLElement
{
    constructor()
    {
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.adoptedStyleSheets = [stylesheet];
    }
    
    connectedCallback()
    {
        const template = document.getElementById("setting");
        const profileSetting = template.content.cloneNode(true);
        this.shadowRoot.appendChild( profileSetting );

        this.render();
    }
    render()
    {
        const float = this.shadowRoot.getElementById("float");
        const editBtn = this.shadowRoot.querySelector(".edit-btn");
        const btn = editBtn.shadowRoot.querySelector(".edit-btn");
        const profileCard = this.shadowRoot.querySelector(".profile-card .section");
        btn.addEventListener( "click", (e) => {
            profileCard.className += " blur";
            float.setAttribute("style", "display: flex");
            document.addEventListener("click", (e) => {
              if ( e.target.getAttribute("name") !== "special-name" )
                {
                    float.setAttribute("style", "display: none");
                    profileCard.classList.remove("blur");
                }
            });
            float.addEventListener("click", (e) => {
                if ( e.target.getAttribute("name") === "Save" )
                    console.log(e.target)
            });
        })
        
    }
}
if (!customElements.get('profile-setting')) {
    customElements.define("profile-setting", ProfileSetting);
}