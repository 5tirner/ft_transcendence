import Api from "../services/api.js";
import ProxiedPlayers from "../prox/players.js";

import StartGame from "../components/StartGame.js"
import TopPlayers from "../components/topPlayers.js"

export function loadStartGameAndPlayerRankComponents(container)
{

    Api.fetchPlayers().then((result) => {
        ProxiedPlayers.playersList = result;
    });

    const startGameComp = document.createElement("start-game-comp");
    container.appendChild(startGameComp);
    

    const middlePlayerRank = document.createElement("div");
    middlePlayerRank.setAttribute("id", "middlePlayerRank")

    const titleDiv = document.createElement("div");
    const componentHolder = document.createElement("div");

    titleDiv.setAttribute("class", "title");
    componentHolder.setAttribute("class", "component-hold");

    middlePlayerRank.appendChild(titleDiv);
    middlePlayerRank.appendChild(componentHolder);

    window.addEventListener("playersListLoaded", () => {
        if (ProxiedPlayers.playersList) {
          ProxiedPlayers.playersList.forEach((element) => {
            const rankedPlayersComponentDiv = document.createElement("player-rank-component");
            componentHolder.appendChild(rankedPlayersComponentDiv);
    
            const name =
              rankedPlayersComponentDiv.shadowRoot.querySelector(".name");
            name.textContent = element.username;
            const points =
              rankedPlayersComponentDiv.shadowRoot.querySelector(".points");
            points.textContent = element.address.zipcode + " pts";
          });
        }
      });
      container.appendChild(middlePlayerRank);
      customElements.define('start-game-comp', StartGame);
      customElements.define("player-rank-component", TopPlayers);
}