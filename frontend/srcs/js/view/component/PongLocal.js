import { socket } from "./assets/socket.js";
export default class PongLocal extends HTMLElement {
	constructor() {
		super();
		this.root = this.attachShadow({ mode: "open" });
	}

	connectedCallback() {
		this.setAttribute("id", "po-local-view");
		this.render();
		this.initialize();
		this.setupWebSocket();
	}

	disconnectedCallback() {
		console.log("Component was removed");

		document.removeEventListener("keyup", this.applyMove);

		this.isGameStarted = false;
		socket.ws.removeEventListener("message", this.handleServerMessage);
		this.startBtn.removeEventListener("click", (e) => this.start(e));
		clearInterval(this.SaveInterval);
		socket.ws.onopen = null;
		socket.ws.onclose = null;
		socket.ws.onmessage = null;
	}

	render() {
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
          #confirm-msg
          {
            backdrop-filter: blur(5px);
            position: absolute;
            top: 0;
            left: 0;
          }
          body
          {
              background-color: rgb(175, 115, 231);
          }
          button
          {
              background-color: rgb(32, 5, 95);
              color: rgb(207, 172, 240);
          }
      </style>
      <div style="margin-bottom: 100px;">
          <h1 style="text-align: center; color: rgb(128, 9, 240);">PONG-PONG-LOCAL</h1>
      </div>
  
      <div style="margin-bottom: 200px;">
        <canvas id="board" width="600" height="300">myCNV</canvas>
      </div>
  
      <div style="text-align: center;">
          <button onclick="style.display = 'none'" class="start-btn">START PLAYING</button>
      </div>
      <abort-btn></abort-btn>
      <confirm-msg game="po-local" id="confirm-msg"></confirm-msg>
  `;
	}

	initialize() {
		socket.ws = new WebSocket("wss://" + location.host + "/localGameWs/");
		this.startBtn = this.root.querySelector(".start-btn");
		this.isGameStarted = false;
		this.xBallPos = 380;
		this.yBallPos = 150;
		this.BallDirection = "LEFT";
		this.paddl1Y = 125;
		this.paddl2Y = 125;
		this.SaveInterval = 0;
		this.BallRoute = "LINE";
		this.canvas = this.root.querySelector("#board");
		this.canvasContext = this.canvas.getContext("2d");
	}

	setupWebSocket() {
		socket.ws.onclose = function () {
			this.isGameStarted = false;
			console.log("BYE FROM SERVER");
			clearInterval(this.SaveInterval);
		};
		socket.ws.onopen = function () {
			console.log("User On Game");
		};

		socket.ws.onclose = function () {
			this.isGameStarted = false;
			console.log("BYE FROM SERVER");
			clearInterval(this.SaveInterval);
		};
		socket.ws.onmessage = (e) => this.handleServerMessage(e);

		this.startBtn.addEventListener("click", (e) => this.start(e));
		document.addEventListener("keyup", (e) => this.applyMove(e));
	}

	drawElements() {
		// console.log("Start Drawing Elements");
		if (this.isGameStarted == true) {
			this.ballMove();
			this.canvasContext.clearRect(
				0,
				0,
				this.canvas.width,
				this.canvas.height
			);

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
		}
	}

	start() {
		this.isGameStarted = true;
		console.log("Game Started Now");
		this.SaveInterval = setInterval(this.drawElements.bind(this), 20);
	}

	handleServerMessage(e) {
		const dataPars = JSON.parse(e.data);
		if (dataPars.MoveFor == "PADDLES MOVE") {
			if (dataPars.paddle1 <= 255 && dataPars.paddle1 >= -5)
				this.paddl1Y = dataPars.paddle1;
			if (dataPars.paddle2 <= 255 && dataPars.paddle2 >= -5)
				this.paddl2Y = dataPars.paddle2;
		} else {
			(this.xBallPos = dataPars.Ballx), (this.yBallPos = dataPars.Bally);
			this.BallDirection = dataPars.BallDir;
			this.BallRoute = dataPars.BallRoute;
		}
	}

	ballMove() {
		// console.log("Start Moving The Ball");
		if (this.xBallPos <= 0 || this.xBallPos >= 600) {
			console.log("Sus 1");
			this.removeEventListener("keyup", (e) => this.applyMove(e));
			this.isGameStarted = false;
			socket.ws.send(JSON.stringify({ gameStatus: "End" }));
			clearInterval(this.SaveInterval);
		} else if (this.isGameStarted == true) {
			//   console.log("Sus 2");
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
		if (this.isGameStarted == true) {
			// console.log("Apply Moves");
			if (
				e.key == "ArrowUp" ||
				e.key == "ArrowDown" ||
				e.key == "w" ||
				e.key == "s"
			) {
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
				else if (e.key == "ArrowDown") ToServer.move = "DOWN";
				else if (e.key == "w" || e.key == "W") ToServer.move = "W";
				else if (e.key == "s" || e.key == "S") ToServer.move = "S";
				socket.ws.send(JSON.stringify(ToServer));
			}
		}
	}
}
customElements.define("po-local-game", PongLocal);

