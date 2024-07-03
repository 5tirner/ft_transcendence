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


        const fullname = this.shadowRoot.querySelectorAll(".fullname");
        const avatar = this.shadowRoot.getElementById("profileImage");
        avatar.setAttribute("src", window.Auth.avatar);
        fullname.forEach( elem => {
            elem.textContent = window.Auth.fullname;
        });

        this.render();
    }
    render()
    {
        const float = this.shadowRoot.getElementById("float");
        const editBtn = this.shadowRoot.querySelector(".edit-btn");
        const btn = editBtn.shadowRoot.querySelector(".edit-btn");
        const profileCard = this.shadowRoot.querySelector(".profile-card .section");
        const input = this.shadowRoot.getElementById("input-fullname");

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
                    {
                        if ( input.value.length == 0 )
                        {
                            console.log("Please enter some shit");
                        }
                        else
                        {
                            float.setAttribute("style", "display: none");
                            profileCard.classList.remove("blur");
                        }
                        // post data to the backend for changing the user fullname
                    }
            });
        })
        
    }
}
if (!customElements.get('profile-setting')) {
    customElements.define("profile-setting", ProfileSetting);
}