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
    }
}
if (!customElements.get('profile-setting')) {
    customElements.define("profile-setting", ProfileSetting);
}