import { socket } from "./assets/socket.js";
export default class PongTour extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.setAttribute("id", "tournament-view");
    this.root.innerHTML = `
      <style>
          body {
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
          }
          .input-container, .canvas-container {
              background-color: #f9f9f9;
              border: 1px solid #ddd;
              border-radius: 8px;
              padding: 15px;
              margin-bottom: 20px;
          }
          .input-container {
              margin-bottom: 10px;
          }
          .player-input {
              margin-bottom: 10px;
          }
          .results {
              margin-top: 20px;
          }
          canvas {
              display: block;
              margin: 0 auto;
              border: 1px solid #000;
          }
      </style>

      <div style="margin-bottom: 100px;">
          <h1 style="text-align: center; color: rgb(128, 9, 240);">PONG-TOUR-PONG</h1>
      </div>

      <div class="input-container">
          <div id="playerInputs">
              <div class="player-input">
                  <label for="player1">Player 1:</label>
                  <input type="text" id="player1" placeholder="Enter name">
              </div>
              <div class="player-input">
                  <label for="player2">Player 2:</label>
                  <input type="text" id="player2" placeholder="Enter name">
              </div>
              <div class="player-input">
                  <label for="player3">Player 3:</label>
                  <input type="text" id="player3" placeholder="Enter name">
              </div>
              <div class="player-input">
                  <label for="player4">Player 4:</label>
                  <input type="text" id="player4" placeholder="Enter name">
              </div>
          </div>
          <button id="startTournament">Start Tournament</button>
      </div>

      Results Section
      <div class="results" id="results"></div>

      <div class="canvas-container" style="margin-bottom: 50px;">
          <canvas id="pongCanvas" width="800" height="400"></canvas>
      </div>
      <abort-btn></abort-btn>
      <confirm-msg game="tournament"></confirm-msg>
    `;
    const resultsDiv = this.root.querySelector("#results");
    const canvas = this.root.querySelector("#pongCanvas");
    const ctx = canvas.getContext("2d");

    function connectWebSocket() {
      socket.ws = new WebSocket("wss://" + location.host + "/Tournaments/");
      socket.ws.onopen = function () {
        console.log("WebSocket connection opened");
      };
      function displayTournamentResults(semiFinals, thirdPlace, finalMatch) {

        resultsDiv.innerHTML += "<h3>Semi-Finals</h3>";
        console.log("semiFInal: ", semiFinals);
        semiFinals.forEach((match, index) => {
          console.log("match: ", match);
          resultsDiv.innerHTML += `<p>Match ${index + 1}: ${match[0]} vs ${match[1]} - Winner: ${match.winner}</p>`;
        });

        resultsDiv.innerHTML += "<h3>Third-Place Match</h3>";
        resultsDiv.innerHTML += `<p>${thirdPlace[0]} vs ${thirdPlace[1]} - Winner: ${thirdPlace.winner}</p>`;

        resultsDiv.innerHTML += "<h3>Final Match</h3>";
        resultsDiv.innerHTML += `<p>${finalMatch[0]} vs ${finalMatch[1]} - Winner: ${finalMatch.winner}</p>`;
      }

      socket.ws.onmessage = function (event) {
        const data = JSON.parse(event.data);

        if (data.status === "success") console.log("Matchups: ", data.matchups);
        else if (data.status === "start_match") {
          alert(`Match starting: ${data.player1} vs ${data.player2}`);
          resetMovementFlags();
          updateGameState(data);
          gameLoop();
        } else if (data.status === "match_result") {
          displayMatchResult(data.stage, data.match_number, data.winner);
        } else if (data.status === "tournament_complete") {
          alert(`Tournament Complete! Winner: ${data.winner}`);
          console.log("he go inside this if that match the result");
          console.log("data.semi_final_results: ", data.semi_final_results);
          console.log("data.third_place_result: ", data.third_place_result);
          console.log("data.final_result: ", data.final_result);
          displayTournamentResults(
            data.semi_final_results,
            data.third_place_result,
            data.final_result,
          ); // document.getElementById('results').innerHTML += `<p><strong>Tournament Winner: ${data.winner}</strong></p>`;
        } else updateGameState(data);
      };

      socket.ws.onclose = function () {
        console.log("WebSocket connection closed");
      };

      socket.ws.onerror = function (error) {
        console.log("WebSocket error observed:", error);
      };
    }

    function displayMatchResult(stage, matchNumber, winner) {
      const stageName =
        stage === "semi_finals"
          ? "Semi-final"
          : matchNumber === 1
            ? "3rd Place"
            : "Final";
      const resultText = `<p>${stageName} ${matchNumber}: Winner - ${winner}</p>`;
      this.root.querySelector("#results").innerHTML += resultText;
    }
    function updateGameState(gameState) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawPaddle(0, gameState.paddle1Y);
      drawPaddle(canvas.width - 10, gameState.paddle2Y);
      drawBall(gameState.ballX, gameState.ballY);
      drawScores(
        gameState.score1,
        gameState.score2,
        gameState.player1,
        gameState.player2,
      );
    }

    function drawPaddle(x, y) {
      ctx.beginPath();
      ctx.rect(x, y, 10, 75);
      ctx.fillStyle = "#0095DD";
      ctx.fill();
      ctx.closePath();
    }

    function drawBall(x, y) {
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fillStyle = "#0095DD";
      ctx.fill();
      ctx.closePath();
    }

    function drawScores(score1, score2, player1, player2) {
      ctx.font = "16px Arial";
      ctx.fillStyle = "#0095DD";
      ctx.fillText(`${player1}: ${score1}`, 20, 20);
      ctx.fillText(`${player2}: ${score2}`, canvas.width - 100, 20);
    }
    function resetMovementFlags() {
      wPressed = false;
      sPressed = false;
      upArrowPressed = false;
      downArrowPressed = false;
    }
    function gameLoop() {
      requestAnimationFrame(gameLoop);
      if (socket.ws.readyState === WebSocket.OPEN) {
        if (wPressed || sPressed) {
          socket.ws.send(
            JSON.stringify({
              action: "paddle_movement",
              player: "player1",
              direction: wPressed ? "up" : "down",
            }),
          );
        }
        if (upArrowPressed || downArrowPressed) {
          socket.ws.send(
            JSON.stringify({
              action: "paddle_movement",
              player: "player2",
              direction: upArrowPressed ? "up" : "down",
            }),
          );
        }
      }
    }

    let upArrowPressed = false;
    let downArrowPressed = false;
    let wPressed = false;
    let sPressed = false;

    this.root
      .querySelector("#startTournament")
      .addEventListener("click",  () => {
        const players = [];
        for (let i = 1; i <= 4; i++) {
          const player = this.root.querySelector(`#player${i}`).value.trim();
          if (player) players.push(player);
        }

        if (players.length < 4) {
          alert("Please enter all four player names.");
          return;
        }
        const uniqueUsernameOfPlyaer = new Set(players);
        if (uniqueUsernameOfPlyaer.size !== players.length) {
          event.preventDefault();
          alert("Duplicate usernames are not allowed!");
        }
        socket.ws.send(
          JSON.stringify({
            action: "submit_players",
            players: players,
          }),
        );

        socket.ws.send(
          JSON.stringify({
            action: "start_tournament",
          }),
        );
      });

    document.addEventListener("keydown", function (event) {
      if (event.key === "ArrowUp") {
        upArrowPressed = true;
      } else if (event.key === "ArrowDown") {
        downArrowPressed = true;
      } else if (event.key === "w") {
        wPressed = true;
      } else if (event.key === "s") {
        sPressed = true;
      }
    });

    document.addEventListener("keyup", function (event) {
      if (event.key === "ArrowUp") {
        upArrowPressed = false;
      } else if (event.key === "ArrowDown") {
        downArrowPressed = false;
      } else if (event.key === "w") {
        wPressed = false;
      } else if (event.key === "s") {
        sPressed = false;
      }
    });

    connectWebSocket();
  }
  disconnectedCallback() {
    document.removeEventListener("keyup", this.applyDown);
  }
}
customElements.define("tournament-game", PongTour);
