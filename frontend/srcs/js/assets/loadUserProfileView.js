import Profile from "../views/ProfileView.js";

export function loadUserProfileView(container)
{
    const elem = document.createElement("profile-page");
    container.appendChild(elem);
    customElements.define("profile-page", Profile);
}