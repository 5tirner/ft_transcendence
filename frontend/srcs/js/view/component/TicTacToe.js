import { socket } from "./assets/socket.js";
import { aborting } from "./assets/abort.js";

export default class TicTacToe extends HTMLElement {
	constructor() {
		super();
		this.root = this.attachShadow({ mode: "open" });
	}

	connectedCallback() {
		this.setAttribute("id", "ttt-view");
		this.render();
		this.initializeGame();
		this.setupWebSocket();
	}

	disconnectedCallback() {
		this.square.forEach((elem) => {
			elem.removeEventListener("click", this.sendDataToServer);
		});
	}

	render() {
		this.root.innerHTML += `
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100%;
          color: var(--dark-teal);
          font-family: "Press Start 2P", sans-serif !important;
        }
        #confirm-msg
        {
          backdrop-filter: blur(5px);
          position: absolute;
          top: 0;
          left: 0;
        }
        h1 {
          text-align: center;
          color: var(--light-olive);
        }
        .players
        {
          width: 100%;
          display: flex;
          justify-content: space-around;
        }
        .board {
          justify-content: center;
          align-items: center;
          display: grid;
          grid-template-columns: repeat(3, 100px);
          grid-template-rows: repeat(3, 100px);
          gap: 10px;
        }
        .square {
          width: 100px;
          height: 100px;
          background-color: var(--light-olive);
          border-radius: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 2rem;
          font-weight: bold;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .square:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
        }
        .squareX {
          color: var(--teal);
        }
        .squareO {
          color: var(--coral);
        } 
      </style>
      <h1>TIC-TAC-TOE GAME</h1>
      <div class="board">
        <div id="square0" class="square" data="0"></div>
        <div id="square1" class="square" data="1"></div>
        <div id="square2" class="square" data="2"></div>
        <div id="square3" class="square" data="3"></div>
        <div id="square4" class="square" data="4"></div>
        <div id="square5" class="square" data="5"></div>
        <div id="square6" class="square" data="6"></div>
        <div id="square7" class="square" data="7"></div>
        <div id="square8" class="square" data="8"></div>
      </div>
      <div class="players">
        <p class="player1name" id="p1"></p>
        <p class="player2name" id="p2"></p>
      </div>
      <abort-btn></abort-btn>
      <confirm-msg game="ttt" id="confirm-msg"></confirm-msg>
      <div class="result"></div>
    `;
	}

	initializeGame() {
		this.domElm1 = this.root.getElementById("p1");
		this.domElm2 = this.root.getElementById("p2");
		this.square = this.root.querySelectorAll(".square");
		this.result = this.root.querySelector(".result");

		this.board = ".........";
		this.isGameStarted = false;

		this.square.forEach((elem) => {
			elem.addEventListener("click", (e) => {
				e.preventDefault();
				this.sendDataToServer(e.target.getAttribute("data"));
			});
		});
	}

	setupWebSocket() {
		socket.ws = new WebSocket("wss://" + location.host + "/GameWS/");

		socket.ws.onopen = () => {
			console.log("User Joined The Game");
		};

		socket.ws.onmessage = (e) => {
			this.handleServerMessage(e);
		};

		socket.ws.onclose = () => {
			console.log("Socket closed BYE BYE");
		};

		window.onbeforeunload = () => {
			aborting(socket.ws, "ttt");
		};
	}

	handleServerMessage(e) {
		const dataPars = JSON.parse(e.data);
		if (this.isGameStarted == false) {
			if (dataPars.player2.length == 0) {
				console.log("Player1: " + dataPars.player1);
				console.log("Player2: " + dataPars.player2);
				console.log("RoomId: " + dataPars.roomid);

				this.domElm1.innerHTML = "PLAYER1: " + dataPars.player1;
				this.domElm2.innerHTML = "PLAYER2: Wait...";
			} else if (dataPars.player2.length != 0) {
				this.isGameStarted = true;
				this.domElm1.innerHTML = "PLAYER1: " + dataPars.player1;
				this.domElm2.innerHTML = "PLAYER2: " + dataPars.player2;
			}
		} else {
			if (dataPars.etat === "end") {
				console.log("Game ended: ", dataPars);
				const resultComp = document.createElement("result-msg");
				resultComp.setAttribute("game", "ttt");
				resultComp.setAttribute("data", e.data);
				this.result.appendChild(resultComp);
			} else if (dataPars.etat == "PLAYING") {
				this.board = dataPars.board;
				const position = dataPars.position;
				const domElem = this.root.querySelector(`#square${position}`);
				if (dataPars.x_o == "X") {
					domElem.innerHTML = "X";
					domElem.classList.add("squareX");
				} else if (dataPars.x_o == "O") {
					domElem.innerHTML = "O";
					domElem.classList.add("squareO");
				}
				// // console.log("Index", board.indexOf("."),  "->" , board[board.indexOf(".")]);
				if (this.isGameEnd(dataPars.x_o, this.board) == true) {
					// console.log("Setting The Result Of This Game On Data Base");
					const toServer = {
						gameStatus: "winner",
						position: -1,
						board: this.board,
						winner: dataPars.user,
						loser: dataPars.oppenent
					};
					socket.ws.send(JSON.stringify(toServer));
				} else if (this.board.indexOf(".") == -1) {
					// console.log("Setting The Result Of This Game On Data Base");
					const toServer = {
						gameStatus: "draw",
						position: -1,
						board: this.board
					};
					socket.ws.send(JSON.stringify(toServer));
				}
			}
		}
	}

	isGameEnd(x_o, board) {
		if (
			(board[0] == x_o && board[1] == x_o && board[2] == x_o) ||
			(board[3] == x_o && board[4] == x_o && board[5] == x_o) ||
			(board[6] == x_o && board[7] == x_o && board[8] == x_o) ||
			(board[0] == x_o && board[3] == x_o && board[6] == x_o) ||
			(board[1] == x_o && board[4] == x_o && board[7] == x_o) ||
			(board[2] == x_o && board[5] == x_o && board[8] == x_o) ||
			(board[0] == x_o && board[4] == x_o && board[8] == x_o) ||
			(board[2] == x_o && board[4] == x_o && board[6] == x_o)
		)
			return true;
		return false;
	}

	sendDataToServer(squareNbr) {
		if (this.isGameStarted == true) {
			const position = Number(squareNbr);
			if (this.board[position] != ".")
				console.log(
					"The Square Already Filled By: ",
					this.board[position]
				);
			else {
				const toServer = {
					gameStatus: "onprogress",
					position: position,
					board: this.board
				};
				socket.ws.send(JSON.stringify(toServer));
			}
		} else console.log("Game Not Start Yet");
	}
}
customElements.define("ttt-game", TicTacToe);

