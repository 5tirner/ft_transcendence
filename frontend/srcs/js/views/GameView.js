import { stylesheet } from "../theme/gameTheme.js"

export default class Game extends HTMLElement
{
    constructor()
    {
        super();
    }

    connectedCallback()
    {
        const style = document.createElement("style");
        const template = document.getElementById("game-page-template");
        const activateTemplate = template.content.cloneNode(true);

        this.setAttribute("id", "game-page");
        style.textContent = stylesheet;
        this.appendChild(style);
        this.appendChild(activateTemplate);
    }
}