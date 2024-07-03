import ProfileSetting from "../components/Settings.js";

export function loadProfileSettings(container)
{
    const elem = document.createElement("profile-setting");
    elem.setAttribute("name", "special-name");
    container.appendChild(elem);
}