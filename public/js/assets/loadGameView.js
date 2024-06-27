import Game from "../views/GameView.js"
import GameMode from "../components/GameMode.js"

export function loadGameView(container, path)
{
    const elem = document.createElement("game-page");
    container.appendChild(elem);
    customElements.define("game-page", Game);

    const componentSection = document.querySelector(".components");

    for ( let i = 1; i <= 3; i++ )
    {
        const gameModeElem = document.createElement("game-mode");
        const imgElem = document.createElement("img");
        console.log("src", path + i + ".jpg");
        imgElem.setAttribute("src", path + i + ".jpg");
        gameModeElem.shadowRoot.appendChild(imgElem);
        componentSection.appendChild(gameModeElem);
    }
    
}