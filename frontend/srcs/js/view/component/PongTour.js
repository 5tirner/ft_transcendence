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
          canvas
          {
              display: block;
              margin: 0 auto;
              background-color: #ccb4e2b0;
              border-color: rgb(128, 9, 240);
              border-width: thin;
              border-style: solid;
              border-block-width: 10px;
              border-radius: 5px;
              filter: brightness(80%);
          }
      
          body
          {
              background-color: rgb(220, 186, 240);
          }
      
          .player1name
          {
              position: absolute;
              left: 0%;
              top: 80%;
              color: #421152;
          }
          
          .player2name
          {
              position: absolute;
              left: 72%;
              top: 80%;
              color: #421152;
          }
      </style>
      <div style="margin-bottom: 100px;">
          <h1 style="text-align: center; color: rgb(128, 9, 240);">PONG-TOUR-PONG</h1>
      </div>
  
      <div style="margin-bottom: 50px;">
        <canvas id="board" width="600" height="300">myCNV</canvas>
      </div>
  
      <h1 class="player1name" id="p1"></h1>
      <h1 class="player2name" id="p2"></h1>
      <abort-btn></abort-btn>
      <confirm-msg game="tournament"></confirm-msg>
    `;
		const domElm1 = this.root.querySelector("#p1");
		const domElm2 = this.root.querySelector("#p2");
		let isGameStarted = false;
		let xBallPos = 280,
			yBallPos = 150;
		let BallDirection = "LEFT";
		let paddl1Y = 125;
		let paddl2Y = 125;
		let BallRoute = "LINE";
		const canvas = this.root.querySelector("#board");
		const canvasContext = canvas.getContext("2d");
		canvasContext.shadowColor = "black";
		canvasContext.shadowBlur = 15;
		canvasContext.shadowOffsetX = 5;
		canvasContext.shadowOffsetY = 2;
		socket.ws = new WebSocket("wss://" + location.host + "/PongTourWs/");
		function ballMove() {
			if (xBallPos < 20 || xBallPos > 580) {
				socket.ws.send(
					JSON.stringify({ gameStatus: "End", Side: BallDirection })
				);
			} else if (isGameStarted == true) {
				const ToServer = {
					WhatIGiveYou: "BALL MOVE",
					gameStatus: "onprogress",
					move: "BALL",
					paddle1: paddl1Y,
					paddle2: paddl2Y,
					ballx: xBallPos,
					bally: yBallPos,
					BallDir: BallDirection,
					BallRoute: BallRoute
				};
				socket.ws.send(JSON.stringify(ToServer));
			}
		}

		async function drawElements() {
			canvasContext.clearRect(0, 0, canvas.width, canvas.height);
			ballMove();
			canvasContext.beginPath();
			canvasContext.lineWidth = 4;
			canvasContext.moveTo(300, 0);
			canvasContext.lineTo(300, 300);
			canvasContext.closePath();
			canvasContext.strokeStyle = "rgb(128, 9, 240)";
			canvasContext.stroke();

			canvasContext.beginPath();
			canvasContext.arc(xBallPos, yBallPos, 10, 0, 6.2);
			canvasContext.lineWidth = 0.5;
			canvasContext.fillStyle = "#F0F8FF";
			canvasContext.fill();
			canvasContext.closePath();
			canvasContext.strokeStyle = "rgb(140, 29, 260)";
			canvasContext.stroke();

			canvasContext.beginPath();
			canvasContext.lineWidth = 8;
			canvasContext.moveTo(20, paddl1Y);
			canvasContext.lineTo(20, paddl1Y + 50);
			canvasContext.closePath();
			canvasContext.strokeStyle = "#F0F8FF";
			canvasContext.stroke();

			canvasContext.beginPath();
			canvasContext.lineWidth = 8;
			canvasContext.moveTo(580, paddl2Y);
			canvasContext.lineTo(580, paddl2Y + 50);
			canvasContext.closePath();
			canvasContext.strokeStyle = "#F0F8FF";
			canvasContext.stroke();
			if (isGameStarted == true)
				await requestAnimationFrame(drawElements);
		}

		function applyMove(e) {
			if (isGameStarted == true) {
				if (e.key == "ArrowUp" || e.key == "ArrowDown") {
					const ToServer = {
						WhatIGiveYou: "PADDLES MOVE",
						gameStatus: "onprogress",
						move: "",
						paddle1: paddl1Y,
						paddle2: paddl2Y,
						ballx: xBallPos,
						bally: yBallPos,
						BallDir: BallDirection,
						BallRoute: BallRoute
					};
					if (e.key == "ArrowUp")
						console.log("GO UP"), (ToServer.move = "UP");
					else console.log("GO DOWN"), (ToServer.move = "DOWN");
					socket.ws.send(JSON.stringify(ToServer));
				}
			}
		}

		document.addEventListener("keyup", applyMove);

		socket.ws.onopen = function () {
			console.log("User On Game");
		};

		socket.ws.onmessage = function (e) {
			const dataPars = JSON.parse(e.data);
			if (isGameStarted == false) {
				isGameStarted = true;
				console.log("Player1: " + dataPars.player1);
				console.log("Player2: " + dataPars.player2);
				console.log("RoomId: " + dataPars.roomid);
				domElm1.innerHTML = "PLAYER1: " + dataPars.player1;
				domElm2.innerHTML = "PLAYER2: " + dataPars.player2;
				requestAnimationFrame(drawElements);
			} else if (isGameStarted == true) {
				if (dataPars.Round == "SemiFinal") {
					if (dataPars.MoveFor == "PADDLES MOVE") {
						if (dataPars.paddle1 <= 255 && dataPars.paddle1 >= -5)
							paddl1Y = dataPars.paddle1;
						if (dataPars.paddle2 <= 255 && dataPars.paddle2 >= -5)
							paddl2Y = dataPars.paddle2;
					} else {
						(xBallPos = dataPars.Ballx),
							(yBallPos = dataPars.Bally);
						BallDirection = dataPars.BallDir;
						BallRoute = dataPars.BallRoute;
					}
				} else if (dataPars.Round == "Final") {
					console.log(
						"The Game Is End, And We Get To The Final Round"
					);
					const ToServer = {
						gameStatus: "NextRound"
					};
					socket.ws.send(JSON.stringify(ToServer));
				} else if (dataPars.Round == "NoRound") {
					console.log("shiiiiit, lose situation here");
					isGameStarted = false;
					// ws.close();
				} else if (dataPars.Round == "FinalRound") {
					isGameStarted = false;
					// ws.close()
					console.log("wooooow, win situation here");
					FinalRoundStart();
				}
			}
		};

		socket.ws.onclose = function () {
			isGameStarted = false;
			console.log("BYE FROM SERVER");
		};

		function FinalRoundStart() {
			const ws2 = new WebSocket(
				"wss://" + location.host + "/PongTourWs/"
			);
			ws2.onopen = function () {
				console.log("Welcome To The Final Round");
			};
		}
	}
	disconnectedCallback() {
		document.removeEventListener("keyup", this.applyDown);
	}
}
customElements.define("tournament-game", PongTour);

