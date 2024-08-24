import { socket } from "./assets/socket.js";

export default class Pong extends HTMLElement {
	constructor() {
		super();
		this.root = this.attachShadow({ mode: "open" });
	}

	connectedCallback() {
		this.setAttribute("id", "pong-view");
		this.render();
		this.initializeGame();
		this.setupWebSocket();
	}

	disconnectedCallback() {
		console.log("Component was removed");
		document.removeEventListener("keyup", this.applyMove);
		this.isGameStarted = false;
		this.isFinsih = true;
		socket.ws.removeEventListener("message", this.handleServerMessage);
		socket.ws.onopen = null;
		socket.ws.onclose = null;
		socket.ws.onmessage = null;
		cancelAnimationFrame(window);
	}

	drawElements() {
		if (this.isGameStarted == true && this.isFinsih == false) {
			this.canvasContext.clearRect(
				0,
				0,
				this.canvas.width,
				this.canvas.height
			);
			this.ballMove();
			this.canvasContext.beginPath();
			this.canvasContext.arc(this.xBallPos, this.yBallPos, 10, 0, 6.2);
			this.canvasContext.lineWidth = 0.5;
			this.canvasContext.fillStyle = "#F0F8FF";
			this.canvasContext.fill();
			this.canvasContext.closePath();
			this.canvasContext.strokeStyle = "rgb(140, 29, 260)";
			this.canvasContext.stroke();

			this.canvasContext.beginPath();
			this.canvasContext.lineWidth = 8;
			this.canvasContext.moveTo(20, this.paddl1Y);
			this.canvasContext.lineTo(20, this.paddl1Y + 50);
			this.canvasContext.closePath();
			this.canvasContext.strokeStyle = "#F0F8FF";
			this.canvasContext.stroke();

			this.canvasContext.beginPath();
			this.canvasContext.lineWidth = 8;
			this.canvasContext.moveTo(580, this.paddl2Y);
			this.canvasContext.lineTo(580, this.paddl2Y + 50);
			this.canvasContext.closePath();
			this.canvasContext.strokeStyle = "#F0F8FF";
			this.canvasContext.stroke();
			requestAnimationFrame(this.drawElements.bind(this));
		}
	}

	render() {
		this.root.innerHTML = `
      <style>
          :host {
              display: block;
              text-align: center;
              margin: 0 auto;
              font-family: var(--body-font);
          }
          #confirm-msg
          {
            backdrop-filter: blur(5px);
            position: absolute;
            top: 0;
            left: 0;
          }
          canvas {
              display: block;
              margin: 20px auto;
              background-color: #ccb4e2b0;
              border: 2px solid #8009F0;
              border-radius: 10px;
              filter: brightness(90%);
          }
          h1 {
              color: #8009F0;
          }
          .player-name {
              position: absolute;
              color: #8009F0;
          }
          .player1 {
              left: 10px;
              bottom: 10px;
          }
          .player2 {
              right: 10px;
              bottom: 10px;
          }
      </style>
      
      <h1>PONG GAME</h1>
      <canvas id="board" width="600" height="300">Your browser does not support canvas</canvas>
      <h2 class="player-name player1" id="p1"></h2>
      <h2 class="player-name player2" id="p2"></h2>
      <abort-btn></abort-btn>
      <confirm-msg game="pong" id="confirm-msg"></confirm-msg>
      <div class="result"></div>
    `;
	}

	initializeGame() {
		console.log("Game Initialized");
		this.canvas = this.root.querySelector("#board");
		this.canvasContext = this.canvas.getContext("2d");
		this.domElm1 = this.root.querySelector("#p1");
		this.domElm2 = this.root.querySelector("#p2");
		this.isGameStarted = false;
		this.isFinsih = false;
		this.xBallPos = 280;
		this.yBallPos = 150;
		this.BallDirection = "LEFT";
		this.paddl1Y = 125;
		this.paddl2Y = 125;
		this.BallRoute = "LINE";
		this.result = this.root.querySelector(".result");
	}

	setupWebSocket() {
		socket.ws = new WebSocket("wss://" + location.host + "/PongGameWs/");
		socket.ws.onclose = () => {
			this.isFinsih = true;
			this.isGameStarted = false;
			cancelAnimationFrame(window);
			console.log("Disconnected from Game Server");
		};
		socket.ws.onopen = () => console.log("Connected to Game Server");
		socket.ws.onmessage = (e) => this.handleServerMessage(e);

		document.addEventListener("keyup", (e) => this.applyMove(e));
	}

	ballMove() {
		if (this.xBallPos < 20 || this.xBallPos > 580) {
			this.isFinsih = true;
			this.isGameStarted = false;
			socket.ws.send(
				JSON.stringify({ gameStatus: "End", Side: this.BallDirection })
			);
		} else if (this.isGameStarted == true && this.isFinsih == false) {
			const ToServer = {
				WhatIGiveYou: "BALL MOVE",
				gameStatus: "onprogress",
				move: "BALL",
				paddle1: this.paddl1Y,
				paddle2: this.paddl2Y,
				ballx: this.xBallPos,
				bally: this.yBallPos,
				BallDir: this.BallDirection,
				BallRoute: this.BallRoute
			};
			socket.ws.send(JSON.stringify(ToServer));
		}
	}

	applyMove(e) {
		if (this.isGameStarted == true && this.isFinsih == false) {
			if (e.key == "ArrowUp" || e.key == "ArrowDown") {
				const ToServer = {
					WhatIGiveYou: "PADDLES MOVE",
					gameStatus: "onprogress",
					move: "",
					paddle1: this.paddl1Y,
					paddle2: this.paddl2Y,
					ballx: this.xBallPos,
					bally: this.yBallPos,
					BallDir: this.BallDirection,
					BallRoute: this.BallRoute
				};
				if (e.key == "ArrowUp") ToServer.move = "UP";
				else ToServer.move = "DOWN";
				socket.ws.send(JSON.stringify(ToServer));
			}
		}
	}

	handleServerMessage(e) {
		const dataPars = JSON.parse(e.data);
		if (this.isGameStarted == false && this.isFinsih == false) {
			if (dataPars.player2.length == 0) {
				console.log("Player1: " + dataPars.player1);
				console.log("Player2: " + dataPars.player2);
				console.log("RoomId: " + dataPars.roomid);
				this.domElm1.innerHTML = "PLAYER1: " + dataPars.player1;
				this.domElm2.innerHTML = "PLAYER2: Wait...";
			} else if (dataPars.player2.length != 0) {
				this.isGameStarted = true;
				console.log("Player1: " + dataPars.player1);
				console.log("Player2: " + dataPars.player2);
				console.log("RoomId: " + dataPars.roomid);
				this.domElm1.innerHTML = "PLAYER1: " + dataPars.player1;
				this.domElm2.innerHTML = "PLAYER2: " + dataPars.player2;
				requestAnimationFrame(this.drawElements.bind(this));
			}
		} else if (dataPars.MoveFor == "end") {
			this.isFinsih == true;
			console.log("Game ended: ", dataPars);
			const resultComp = document.createElement("result-msg");
			resultComp.setAttribute("game", "pong");
			resultComp.setAttribute("data", e.data);
			this.result.appendChild(resultComp);
		} else if (this.isGameStarted == true && this.isFinsih == false) {
			if (dataPars.MoveFor == "PADDLES MOVE") {
				if (dataPars.paddle1 <= 255 && dataPars.paddle1 >= -5)
					this.paddl1Y = dataPars.paddle1;
				if (dataPars.paddle2 <= 255 && dataPars.paddle2 >= -5)
					this.paddl2Y = dataPars.paddle2;
			} else {
				(this.xBallPos = dataPars.Ballx),
					(this.yBallPos = dataPars.Bally);
				this.BallDirection = dataPars.BallDir;
				this.BallRoute = dataPars.BallRoute;
			}
		}
	}
}
customElements.define("pong-game", Pong);

