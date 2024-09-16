import { socket } from "./assets/socket.js";
export default class PongLocal extends HTMLElement
{
	constructor()
	{
		super();
		this.root = this.attachShadow({ mode: "open" });
	}
	connectedCallback() {
		this.setAttribute('id', 'pong-view');
		this.root.innerHTML = `
		  <style>
			body {
				background-color: #282c34;
				color: #61dafb;
				font-family: Arial, sans-serif;
				text-align: center;
				margin: 0;
				overflow: hidden;
				display: flex;
				justify-content: center;
				align-items: center;
				height: 100vh;
			}
			#game-container {
				display: flex;
				flex-direction: column;
				align-items: center;
			}
			#pongCanvas {
				border: 2px solid #61dafb;
				background-color: #000;
				border-radius: 10px;
			}
			.hidden {
				display: none;
			}
			#winner-message
			{
				color: var(--light-olive);
			}
		  </style>
			 <div id="game-container">
			<h1 id="winner-message" class="hidden">Player Wins!</h1>
			<canvas id="pongCanvas" width="800" height="400"></canvas>
		</div>
		  <abort-btn></abort-btn>
		  <confirm-msg game="pong"></confirm-msg>
		`;
		// this.startBtn = this.root.querySelector('.start-btn');
		const canvas = this.root.querySelector('#pongCanvas');
		const context = canvas.getContext('2d');
		const winnerMessage = this.root.querySelector('#winner-message');
		
		const paddleWidth = 10;
		const paddleHeight = 75;
		// const paddleSpeed = 8;
		
		const playerX1 = 0;
		const playerX2 = canvas.width - paddleWidth;
		let playerY1 = (canvas.height - paddleHeight) / 2;
		let playerY2 = (canvas.height - paddleHeight) / 2;
		
		let ballX = canvas.width / 2;
		let ballY = canvas.height / 2;
		const ballRadius = 10;
	
		let ballSpeedX = 2;
		let ballSpeedY = 2;
	
		let score1 = 0;
		let score2 = 0;
		// const winningScore = 3;
	
		let player1Up = false;
		let player1Down = false;
		let player2Up = false;
		let player2Down = false;
	
		let gameOver = false;
	
		let ws;
	
		function connectWebSocket()
		{
			ws = new WebSocket('wss://' + window.location.host + '/localGameWs/');
	
			ws.onopen = function() {
				console.log('WebSocket connection opened');
			};
	
			ws.onmessage = function(event)
			{
				const data = JSON.parse(event.data);
				// console.log('Data received:', data);
				playerY1 = data.paddle1Y;
				playerY2 = data.paddle2Y;
				ballX = data.ballX;
				ballY = data.ballY;
				ballSpeedX = data.ballSpeedX;
				ballSpeedY = data.ballSpeedY;
				score1 = data.score1;
				score2 = data.score2;
				player1Up = data.player1Up;
				player2Up = data.player2Up;
				player1Down = data.player1Down;
				player2Down = data.player2Down;
				gameOver = data.gameOver;
				winnerMessage.textContent = data.winnerMessage;
				if (gameOver)
					winnerMessage.classList.remove('hidden');
			};
	
			ws.onclose = function() {
				console.log('WebSocket connection closed');
			};
	
			ws.onerror = function(error) {
				console.log('WebSocket error observed:', error);
			};
		}
	
		connectWebSocket();
	
		function draw()
		{
			context.clearRect(0, 0, canvas.width, canvas.height);
	
			// Draw background of the game
			context.fillStyle = "#000000";
			context.fillRect(0, 0, canvas.width, canvas.height);
	
			// Draw paddles
			context.fillStyle = 'white';
			context.fillRect(playerX1, playerY1, paddleWidth, paddleHeight);
			context.fillRect(playerX2, playerY2, paddleWidth, paddleHeight);
	
			// Draw ball
			context.beginPath();
			context.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
			context.fill();
			context.closePath();
	
			// Draw score
			context.font = "30px Arial";
			context.fillText(score1, 300, 50);
			context.fillText(score2, 500, 50);

			// Draw players
			context.font = "25px Arial";
			context.fillStyle = 'white';
			context.fillText("Player 1", 20, 50);
			context.fillText("Player 2", 680, 50);
		}
	
		// function resetBall() {
		// 	ballX = canvas.width / 2;
		// 	ballY = canvas.height / 2;
		// 	ballSpeedX = -ballSpeedX;
		// 	ballSpeedY = 2;
		// 	// console.log('Ball reset:', { ballX, ballY, ballSpeedX, ballSpeedY });
		// }
	
		function update() {
			if (gameOver)
				return;
	
			const gameState = {
				paddle1Y: playerY1,
				paddle2Y: playerY2,
				player1Up: player1Up,
				player2Up: player2Up,
				player1Down:player1Down,
				player2Down:player2Down,
				ballX: ballX,
				ballY: ballY,
				ballSpeedX: ballSpeedX,
				ballSpeedY: ballSpeedY,
				score1: score1,
				score2: score2,
				gameOver: gameOver,
				winnerMessage: winnerMessage.textContent
			};
	
			// console.log('Sending game state:', gameState);
			if (ws.readyState === WebSocket.OPEN)
				ws.send(JSON.stringify(gameState));
		}
	
		function gameLoop() {
			update();
			draw();
			requestAnimationFrame(gameLoop);
		}
	
		document.addEventListener('keydown', function(event) {
			// console.log(`Key down: ${event.key}`);
			switch(event.key) {
				case 'w':
					player1Up = true;
					break;
				case 's':
					player1Down = true;
					break;
				case 'ArrowUp':
					player2Up = true;
					break;
				case 'ArrowDown':
					player2Down = true;
					break;
			}
		});
	
		document.addEventListener('keyup', function(event) {
			// console.log(`Key up: ${event.key}`);
			switch(event.key) {
				case 'w':
					player1Up = false;
					break;
				case 's':
					player1Down = false;
					break;
				case 'ArrowUp':
					player2Up = false;
					break;
				case 'ArrowDown':
					player2Down = false;
					break;
			}
		});
	
		gameLoop();
	  }
	  disconnectedCallback()
	  {
		document.removeEventListener("keyup", this.applyDown);
	  }
}
customElements.define("po-local-game", PongLocal);

