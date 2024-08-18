export default class PongLocal extends HTMLElement {
	constructor() {
		super();
		this.root = this.attachShadow({ mode: "open" });
	}
	connectedCallback() {
		this.setAttribute("id", "pong-view");
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
      <confirm-msg game="pong"></confirm-msg>
    `;
		this.startBtn = this.root.querySelector(".start-btn");
		let isGameStarted = false;
		let xBallPos = 380,
			yBallPos = 150;
		let BallDirection = "LEFT";
		let paddl1Y = 125;
		let paddl2Y = 125;
		var SaveInterval = 0;
		let BallRoute = "LINE";
		const canvas = this.root.querySelector("#board");
		const canvasContext = canvas.getContext("2d");
		// canvasContext.shadowColor = "black";
		// canvasContext.shadowBlur = 15;
		// canvasContext.shadowOffsetX = 5;
		// canvasContext.shadowOffsetY = 2;
		socket.ws = new WebSocket("ws://" + location.host + "/localGameWs/");

		function ballMove() {
			if (xBallPos <= 0 || xBallPos >= 600) {
				isGameStarted = false;
				// clearTimeout(drawElements);
				socket.ws.send(JSON.stringify({ gameStatus: "End" }));
				clearInterval(SaveInterval);
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
		this.startBtn.addEventListener("click", start);
		function drawElements() {
			ballMove();
			canvasContext.clearRect(0, 0, canvas.width, canvas.height);
			// canvasContext.beginPath();
			// canvasContext.lineWidth = 4;
			// canvasContext.moveTo(300, 0);
			// canvasContext.lineTo(300, 300);
			// canvasContext.closePath();
			// canvasContext.strokeStyle = "rgb(128, 9, 240)";
			// canvasContext.stroke();

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
			// console.log(isGameStarted);
			// if (isGameStarted == true)
			//   requestAnimationFrame(drawElements);
		}

		function applyMove(e) {
			// console.log(e.key);
			if (isGameStarted == true) {
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
						paddle1: paddl1Y,
						paddle2: paddl2Y,
						ballx: xBallPos,
						bally: yBallPos,
						BallDir: BallDirection,
						BallRoute: BallRoute
					};
					if (e.key == "ArrowUp") ToServer.move = "UP";
					else if (e.key == "ArrowDown") ToServer.move = "DOWN";
					else if (e.key == "w") ToServer.move = "W";
					else if (e.key == "s") ToServer.move = "S";
					socket.ws.send(JSON.stringify(ToServer));
				}
			}
		}

		function start() {
			isGameStarted = true;
			// console.log("Game Started Now");
			SaveInterval = setInterval(drawElements, 5);
		}

		document.addEventListener("keyup", applyMove);

		socket.ws.onopen = function () {
			console.log("User On Game");
		};

		socket.ws.onmessage = function (e) {
			const dataPars = JSON.parse(e.data);
			if (dataPars.MoveFor == "PADDLES MOVE") {
				if (dataPars.paddle1 <= 255 && dataPars.paddle1 >= -5)
					paddl1Y = dataPars.paddle1;
				if (dataPars.paddle2 <= 255 && dataPars.paddle2 >= -5)
					paddl2Y = dataPars.paddle2;
			} else {
				(xBallPos = dataPars.Ballx), (yBallPos = dataPars.Bally);
				BallDirection = dataPars.BallDir;
				BallRoute = dataPars.BallRoute;
			}
		};

		socket.ws.onclose = function () {
			console.log("BYE FROM SERVER");
		};
	}
	disconnectedCallback() {
		document.removeEventListener("keyup", this.applyDown);
	}
}