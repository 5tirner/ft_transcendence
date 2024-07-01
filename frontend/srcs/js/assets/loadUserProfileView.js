import Profile from "../views/ProfileView.js";

export function loadUserProfileView(container)
{
    const elem = document.createElement("profile-page");
    container.appendChild(elem);
    if ( !customElements.get("profile-page") )
        customElements.define("profile-page", Profile);
}