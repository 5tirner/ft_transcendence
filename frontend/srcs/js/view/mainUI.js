import { auth } from '../auth/Authentication.js';
import { aborting } from '../assets/abort.js';
const socket = {
  ws: null
}
// Login View
export class Login extends HTMLElement {
  constructor() { super('foo'); this.root = this.attachShadow({ mode: 'open' }); }
  connectedCallback() {
    this.setAttribute("id", "login-view");
    this.setAttribute('hidden', '');
    this.root.innerHTML += `
    <style>
      a {
        text-decoration: none;
      }
      .bluer {
        width: 100% !important;
        height: 100% !important;
        filter: blur(5px);
        backdrop-filter: blur(5px);
        position: absolute;
        left: 0;
        top: 0;
        z-index: 9;
      }
      .login-form {
        width: 35%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 15px;
        z-index: 99;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        transition: ease-in;
        transition-delay: 5s;
        padding-top: 20px;
        padding-bottom: 40px;
        box-shadow: rgba(68, 68, 68, 0.1) 0px 4px 16px, rgba(68, 68, 68, 0.1) 0px 8px 24px, rgba(68, 68, 68, 0.1) 0px 16px 56px;
      }
      
      .sub-login-form {
        width: 75%;
        height: 100%;
        text-align: center;
      }
      
      .logo {
        color: var(--light-olive);
        font-weight: 400;
        padding-top: 10px;
        padding-bottom: 20px;
      }
      
      .google-btn {
        padding-top: 10px;
        padding-bottom: 10px;
        display: flex;
        justify-content: center;
        color: var(--peach);
      }
      
      a .intra-42
      {
        background: rgb(190, 60, 237) !important;
        background: linear-gradient(
          90deg,
          rgba(190, 60, 237, 1) 43%,
          rgb(158, 165, 179) 100%
        ) !important;
        border: none !important;
      }
      .intra-btn {
        padding-top: 10px;
        padding-bottom: 10px;
        display: flex;
        justify-content: center;
      }
      /* --------------- Google + Intra buttons -------------- */
      .button-23 {
        font-size: 80%;
        font-weight: 300;
        text-transform: uppercase;
        letter-spacing: 1px;
        border: none;
        cursor: pointer;
        display: inline-block;
        padding: 2.5% 6%;
        border-radius: 8px;
        background-color: var(--dark-teal);
        color: var(--light-olive);
        box-shadow: 0 0 0 3px #2f2e41, 0 6px 0 #2f2e41;
        transition: all 0.1s ease, background 0.3s ease;
        font-family: "Press Start 2P", sans-serif !important;
      }
      .button-23:focus-visible {
        box-shadow: #222222 0 0 0 2px, rgba(255, 255, 255, 0.8) 0 0 0 4px;
        transition: box-shadow 0.2s;
        outline: none;
        border-color: inherit;
        -webkit-box-shadow: none;
        box-shadow: none;
      }
      .button-23:active {
        transform: scale(0.96);
        outline: none;
      }
      .button-23 span {
        font-size: 14px;
      }
    </style>
    <filter class="bluer"></filter>
    <div class="login-form">
			<div class="sub-login-form">
				<div class="logo">Pong.me</div>
				<div class="google-intra-login">
					<a href="/platform" class="google-btn" name="google">
						<button
							type="button"
							role="button"
							class="button-23"
							
						>
							<span class="G">G </span>Login with google<span>
								>
							</span>
						</button>
					</a>
					<a href="/platform" class="intra-btn" name="intra">
						<button
							type="button"
							role="button"
							class="button-23 intra-42"
							
						>
							<span class="42">42 </span>Login with Intra<span>
								>
							</span>
						</button>
					</a>
				</div>
			</div>
		</div>
    `;
    this.root.querySelector('.bluer').addEventListener('click', () => {
      this.setAttribute('hidden', '');
    });
    const links = this.root.querySelectorAll("a");
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        window.Auth.loginIntra()
      });
    });
  }
  // onclick="window.Auth.loginIntra()"
  // onclick="window.Auth.loginGoogle()"
}
// Home View
export class Home extends HTMLElement
{
  constructor() { super('foo') };
  connectedCallback()
  {
    this.setAttribute("id", "home-view");
    this.setAttribute('hidden', '');
    this.innerHTML += `
      <login-view></login-view>
      <nav class="d-flex navbar justify-content-between">
          <a class="navbar-brand" href="/">Pong.me</a>
          <a class="home-buttons navbar-btn login-btn" href="/login">
              Login
          </a>
      </nav>
      <main class="home">
          <h1>Discover, Play & Challenge Your Friends</h1>
          <p>
              Pong.me support realtime game, chat, group chat channel,
              ranking system and tournament.
          </p>
          <a class="home-buttons navbar-btn discover-btn" href="/platform">
              Discover Now
          </a>
      </main>
    `;
    this.anchors();
  }
  anchors()
  {
    const links = this.querySelectorAll("a");
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        // console.log("clicked");
        this.querySelector('login-view').removeAttribute('hidden');
      });
    });
  }
}
// Sidebar View
export class Sidebar extends HTMLElement
{
    constructor()
    {
        super('foo');
    }
    // skipcq: JS-0057
    connectedCallback()
    {
        this.setAttribute("id", "sidebar-view");

        this.innerHTML +=
        `
            <nav export class="nav">
                <a href="/platform" export class="nav_logo">
                    <i export class="bx bx-grid-alt nav_icon"></i>
                </a>
                <div export class="nav_list">
                    <a href="/setting" class="nav_link">
                        <i class="bx bxs-cog nav_icon"></i>
                    </a>
                    <a href="/friend" class="nav_link">
                        <i class='bx bx-group nav_icon'></i>
                    </a>
                    <a href="/" class="nav_link">
                        <i class="bx bx-log-out nav_icon"></i>
                    </a>
                </div>
				<a href="/profile" class="nav_link">
					<i export class="bx bx-user nav_icon"></i>
				</a>
			</nav>
        `;
        this.doSomeThing();
    }
    doSomeThing()
    {
        const arr = this.querySelectorAll("a");
        arr.forEach(elem => {
            elem.addEventListener("click", (e) => {
                e.preventDefault();
                const href = e.currentTarget.getAttribute("href");
                
                    // if ( href === "/" )
                    // {
                    //     // TODO: handle the logout logic
                    //     Auth.logout();
                    //     global.router.goto(href);
                        
                    // }
                    window.router.goto(href);
            });
        });
    }
}
// Game View
export class Game extends HTMLElement
{
    constructor() { super('foo'); }
    connectedCallback()
    {
        this.setAttribute("id", "game-view");
        this.setAttribute("hidden", "");
        this.innerHTML += `
            <style>
                #ttt-view
                {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    gap: 100px;
                    background-color: var(--light-olive);
                }
                ::backdrop
                {
                    background-color: var(--light-olive);
                }
                .game-section
                {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 95%;
                    height: 100%;
                    margin-bottom: 30px;
                    border: 1px solid var(--teal);
                    position: relative;
                }
                .fscreen-btn
                {
                    position: absolute;
                    top:  15px;
                    right:  15px;
                    background: rgba(0,0,0,0.05);
                    border:  0;
                    width:  40px;
                    height:  40px;
                    border-radius: 50%;
                    box-sizing: border-box;
                    transition:  transform .3s;
                    cursor:  pointer;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .fscreen-btn:hover {
                    transform: scale(1.125);
                }
                .fscreen-btn svg:nth-child(2) { 
                    display: none;
                }
                [fullscreen] .fscreen-btn svg:nth-child(1) {
                    display: none;
                }
                [fullscreen] .fscreen-btn svg:nth-child(2) {
                    display: inline-block;
                }

                .game-mode-section
                {
                    .game-mode-title
                    {
                        color: #fff;
                        padding: 10px 0;
                    }
                    .game-mode-component
                    {
                        width: 100%;
                        display: flex;
                        flex-direction: row;
                        justify-content: space-around;
                    }
                    height: 230px;
                    width: 90%;
                    align-items: center;
                }   
            </style>
            <div class="game-section">
              <button class="fscreen-btn">
                  <svg viewBox="0 0 24 24">
                      <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 
                      7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                  </svg>
                  <svg viewBox="0 0 24 24">
                      <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 
                      11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
                  </svg>
              </button>
            </div>
        `;
     
        if ( document.fullscreenEnabled )
        {
            const button = this.querySelector("button");
            button.addEventListener("click", toggleFscreen);
        }
        function toggleFscreen()
        {
            // console.log("clicked: ", document.body.getAttribute("fullscreen"));
            if (document.body.getAttribute("fullscreen") === null) {
                document.body.setAttribute("fullscreen","");
                window.component.middle.setAttribute('style', "flex-basis: 100%");
            } else {
                document.body.removeAttribute("fullscreen");
                window.component.middle.removeAttribute('style');
            }
        }
    }
}
// User Profile View
export class Profile extends HTMLElement
{
    constructor()
    {
      super('foo');
      this.root = this.attachShadow({ mode: "open" });
    }
    // connected call back
    connectedCallback()
    {
      this.setAttribute("id", "profile-view");
      this.setAttribute("hidden", "");
      this.root.innerHTML = `
        <style>
            :host {
              width: 100%;
              height: 100%;
            }
            .first {
              margin: 0 auto;
              border: solid 1px rgb(100 100 100 / .5)!important;
              border-radius: 18px;
              width: 90%;
              height: 30%;
              display: flex;
              flex-flow: row wrap;
              justify-content: space-between;
              padding: 20px;
              background-color: var(--teal);
            }
            .common {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: end;
              font-size: 10px;
              padding-bottom: 40px;
            }
            .win {
              flex-grow: 2;
              flex-basis: 2%}
            .user {
              flex: 4;
              flex-basis: 8%}
            .avatar {
              width: 100%;
              text-align: center;
            }
            div img {
              width: 150px;
              height: 150px;
              border: solid 2px rgb(200 200 200 / .75)!important;
              border-radius: 50%;
              background: rgb(100 100 100 / .75);
              object-fit: cover;
            }
            .info {
              width: 100%;
              padding-top: 20px;
              text-align: center;
              color: red;
            }
            .info:last-child {
              color: rgb(200 200 200 / .75);
              font-size: 8px;
            }
            .loss {
              flex-grow: 2;
              flex-basis: 2%;
            }
        </style>
        <div class="first">
          <div class="win common">Win Count: ${auth.wins}</div>
          <div class="user common">
              <div class="avatar">
                <img src="${auth.avatar}" alt="" />
              </div>
              <div class="fullname info">${auth.fullname}</div>
              <div class="username info">@${auth.user}</div>
          </div>
          <div class="loss common">Loss Count: ${auth.loses}</div>
        </div>
      `;
    }
}
// Platform View
export class Platform extends HTMLElement
{
  constructor()
  {
    super('foo');
    this.root = this.attachShadow({mode:"open"});
  }
  connectedCallback()
  {
    this.setAttribute('id', 'platform-view');
    this.setAttribute('hidden', '');
    this.root.innerHTML += `
    <style>
      :host
      {
          width: 100%;
          height: 100%;
      }
      a
      {
          text-decoration: none;
      }
      .container
      {
          width: 100%;
          height: 35%;
          display: flex;
          flex-direction: row;
      }
      .wrapper
      {
          margin: 0 auto;
          display: flex;
          gap: 150px;
          width: 80%;
          height: 100%;
      }
      .pong, .xo
      {
          width: 100%;
          position: relative;
      }
      .xo
      {
          justify-content: start !important;
      }
      .pong img, .xo img
      {
          border-radius: 12px;
          width: 100%;
          height: 100%;
      }
      .btn-wrapper
      {
          width: 100%;
          position: absolute;
          bottom: 24px;
          left: 0;
          display: flex;
          justify-content: space-around;
      }
      .button 
      {
        font-size: 10px;
        font-weight: 300;
        text-transform: uppercase;
        letter-spacing: 1px;
        border: none;
        cursor: pointer;
        display: inline-block;
        padding: 2.5% 6%;
        border-radius: 8px;
        background-color: var(--dark-teal);
        color: var(--light-olive);
        box-shadow: 0 0 0 3px #2f2e41, 0 6px 0 #2f2e41;
        transition: all 0.1s ease, background 0.3s ease;
        font-family: "Press Start 2P", sans-serif !important;
      }
      .po-local
      {
          background: var(--coral) !important;
      }
      .local-xo
      {
          background: var(--light-olive) !important;
          color: var(--coral);
      }
      .button:hover,
      .button:focus
      {
          background: #df6108;
      }
      .rank
      {
          margin-top: 80px;
          width: 100%;
          height: 55%;
          display: flex;
          flex-direction: column;
          align-items: center;
      }
      .rank-title
      {
          padding: 10px 0;
          width: 100%;
          text-align: center;
          color: var(--dark-purple);
      }
      .avatar {
          width: 120px;
          height: 120px;
          border-radius: 12px;
      }
      .avatar img{
          width: 100%;
          height: 100%;
          border-radius: 12px;
      }
      
      .name {
          width: 100%;
          text-align: center;
          color: var(--light-olive);
          font-size: 12px;
          padding: 10px 0;
      
      }
      .points {
          margin-top: 5px;
          color: var(--dark-purple);
          width: 100%;
          height: 20%;
          text-align: center;
          font-size: 10px;
      }
      .rank-card
      {
          margin-top: 20px;
          min-width: 180px;
          max-width: 180px;
          border-radius: 12px;
          background-color: var(--teal);
          height: 50%;
          padding: 15px 10px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          max-height: 100%;
      }
      .rank:hover .slide
      {
          animation-play-state: paused;
      }
      @keyframes sliding
      {
          from{ transform: translateX(80%); }
          to{ transform: translateX(-100%); }
      }
      .slide
      {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: row;
          justify-content: center;
          gap: 2.5rem;
          animation: 10s sliding infinite linear;
      }
      @media screen and (max-width: 900px) {
        .container {
          width: 100%;
          height: 35%;
          display: flex;
          flex-direction: column;
        }
        .wrapper
        {
           display: flex;
           flex-direction: column;
           gap: 40px;
        }
        .rank
        {
          display: none;
        }
      }
    </style>
    <div class="container">
        <div class="wrapper">
            <div class="pong">
                <img src="js/view/src/img/pong.gif">
                <div class="btn-wrapper">
                <a href="/game" class="button po-btn multi common" game="pong">
                  Multiplayer
                </a>
                    <button class="button po-local">Local</button>
                </div>
            </div>
            <div class="xo">
                <img src="js/view/src/img/xo-teal.gif">
                <div class="btn-wrapper">
                  <a href="/game" class="button xo-btn multi common" game="ttt">
                    Multiplayer
                  </a>
                  <button class="button local-xo">Local</button>
                </div>
            </div>
        </div>
    </div>
    <div class="rank">
        <div class="rank-title">Players Rank</div>
        <div class="slide">
            <div class="rank-card">
                <div class="avatar">
                    <!-- <img src="https://avatar.iran.liara.run/public" alt="avatar"> -->
                </div>
                <div class="name">YACHAAB</div>
                <div class="points">199pts</div>
            </div>
        </div>
    </div>
    `;
    this.startGame = this.root.querySelectorAll(".common");
    this.poLocal = this.root.querySelector('.po-local');
    this.startGame.forEach(elem => {
      elem.addEventListener("click", (e) => {
        e.preventDefault();
        const game = e.target.getAttribute("game");
        manipulateGameSection(game);
      });
    });
    const manipulateGameSection = ( gameToAppend ) =>
    {
      const gameSection = document.querySelector('.game-section');
      const gameElem    = document.querySelector(`#${gameToAppend}-view`);
      if (gameElem !== null)
        gameElem.remove();
      else
        gameSection.appendChild(document.createElement(`${gameToAppend}-view`));
      window.router.redirecto("/game");
    }
    
    this.poLocal.addEventListener('click', () => manipulateGameSection('po-local'));
    
    window.onpopstate = (e) => {
      // console.log("bro state should change to: ", e.state.path);
      window.router.goto(e.state.path);
    };
  }
  
  disconnectedCallback()
  {
    this.startGame.forEach(elem => {
      elem.removeEventListener("click", (e) => {
        e.preventDefault();
        const game = e.target.getAttribute("game");
        manipulateGameSection(game);
      });
    });
  }
}
// TicTacToe View
export class TTT extends HTMLElement
{
  constructor()
  {
    super('foo');
    this.root = this.attachShadow({mode: 'open'});
  }
  connectedCallback() {
    this.setAttribute('id', 'ttt-view');
    this.root.innerHTML += `
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100%;
          color: var(--dark-teal);
          font-family: "Press Start 2P", sans-serif !important;
        }
        h1 {
          text-align: center;
          color: var(--dark-teal);
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
          background-color: #fff;
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
          color: #3498db;
        }
        .squareO {
          color: #e74c3c;
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
      <confirm-msg game="ttt"></confirm-msg>
    `;
    
    const domElm1 = this.root.getElementById("p1");
    const domElm2 = this.root.getElementById("p2");
    this.square  = this.root.querySelectorAll(".square");

    this.square.forEach(elem => {
      elem.addEventListener('click', (e) => {
        e.preventDefault();
        sendDataToServer(e.target.getAttribute('data'));
      });
    });
    

    socket.ws = new WebSocket('ws://' + location.host + '/GameWS/');
    let board = '.........';
    let isGameStarted = false;

    function isGameEnd(x_o, board) {
      if ((board[0] == x_o && board[1] == x_o && board[2] == x_o)
        || (board[3] == x_o && board[4] == x_o && board[5] == x_o)
        || (board[6] == x_o && board[7] == x_o && board[8] == x_o)
        || (board[0] == x_o && board[3] == x_o && board[6] == x_o)
        || (board[1] == x_o && board[4] == x_o && board[7] == x_o)
        || (board[2] == x_o && board[5] == x_o && board[8] == x_o)
        || (board[0] == x_o && board[4] == x_o && board[8] == x_o)
        || (board[2] == x_o && board[4] == x_o && board[6] == x_o))
        return true;
      return false;
    }
    
    socket.ws.onopen = function () {
      // console.log("User On Game");
    }
    
    socket.ws.onmessage = (e) => {
      const dataPars = JSON.parse(e.data)
      if (isGameStarted == false) {
        if (dataPars.player2.length == 0) {
          // console.log("Player1: " + dataPars.player1);
          // console.log("Player2: " + dataPars.player2)
          // console.log("RoomId: " + dataPars.roomid)

          domElm1.innerHTML = "PLAYER1: " + dataPars.player1;
          domElm2.innerHTML = "PLAYER2: Wait...";
        }
        else if (dataPars.player2.length != 0) {
          isGameStarted = true;
          // console.log("Player1: " + dataPars.player1);
          // console.log("Player2: " + dataPars.player2)
          // console.log("RoomId: " + dataPars.roomid)
          domElm1.innerHTML = "PLAYER1: " + dataPars.player1;
          domElm2.innerHTML = "PLAYER2: " + dataPars.player2;
        }
      }
      else {
        if (dataPars.etat == "PLAYING") {
          // console.log('Game On Progress');
          // console.log(e.data);
          board = dataPars.board;
          const position = dataPars.position;
          const domElem = this.root.getElementById(`square${position}`);
          if (dataPars.x_o == "X") {
            domElem.innerHTML = "X";
            domElem.classList.add("squareX");
          }
          else if (dataPars.x_o == "O")
          {
            domElem.innerHTML = "O";
            domElem.classList.add("squareO");
          }
          // // console.log("Index", board.indexOf("."),  "->" , board[board.indexOf(".")]);
          if (board.indexOf(".") == -1)
          {
            // console.log("Setting The Result Of This Game On Data Base");
            const toServer = { 'gameStatus': "draw", 'position': -1, 'board': board};
            socket.ws.send(JSON.stringify(toServer));
          }


          if (isGameEnd(dataPars.x_o, board) == true)
          {
            // console.log("Setting The Result Of This Game On Data Base");
            const toServer = { 'gameStatus': "winner", 'position': -1, 'board': board,
                            'winner': dataPars.user, 'loser': dataPars.oppenent};
            socket.ws.send(JSON.stringify(toServer));
          }
        }
      }
    }
    
    function sendDataToServer(squareNbr)
    {
      if (isGameStarted == true)
      {
        const position = Number(squareNbr);
        if (board[position] != '.')
          console.log('The Square Already Filled By: ', board[position]);
        else {
          const toServer = { 'gameStatus': "onprogress", 'position': position, 'board': board };
          socket.ws.send(JSON.stringify(toServer));
        }
      }
      else
        console.log('Game Not Start Yet');
    }
    socket.ws.onclose = function () {
      // console.log("Socket closed BYE BYE");
    }
    window.onbeforeunload = function () {
      aborting(socket.ws, 'ttt');
    }
  }
  disconnectedCallback()
  {
    this.square.forEach(elem => {
      elem.removeEventListener('click', (e) => {
        e.preventDefault();
        sendDataToServer(e.target.getAttribute('data'));
      });
    });
  }
}
// Pong View
export class Pong extends HTMLElement
{
  constructor()
  {
    super('foo');
    this.root = this.attachShadow({mode: 'open'});
  }
  connectedCallback() {
    this.setAttribute('id', 'pong-view');
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
          <h1 style="text-align: center; color: rgb(128, 9, 240);">PONG-PONG-PONG</h1>
      </div>
  
      <div style="margin-bottom: 50px;">
        <canvas id="board" width="600" height="300">myCNV</canvas>
      </div>
  
      <h1 class="player1name" id="p1"></h1>
      <h1 class="player2name" id="p2"></h1>
      <abort-btn></abort-btn>
      <confirm-msg game="pong"></confirm-msg>
    `;

    const domElm1 = this.root.querySelector("#p1"), domElm2 = this.root.querySelector("#p2");
    let isGameStarted = false;
    let xBallPos = 280, yBallPos = 150;
    let BallDirection = "LEFT";
    let paddl1Y = 125;
    let paddl2Y = 125;
    // let SaveInterval = 0;
    let BallRoute = "LINE";
    const canvas = this.root.querySelector("#board");
    const canvasContext = canvas.getContext('2d');
    canvasContext.shadowColor = "black";
    canvasContext.shadowBlur = 15;
    canvasContext.shadowOffsetX = 5;
    canvasContext.shadowOffsetY = 2;
    socket.ws = new WebSocket('ws://' + location.host + '/PongGameWs/');

    function ballMove()
    {
      if (xBallPos <= 0 || xBallPos >= 600)
        socket.ws.send(JSON.stringify({'gameStatus': 'End', 'Side': BallDirection}));
      else
      {
        const ToServer =
        {
          'WhatIGiveYou': "BALL MOVE",
          'gameStatus': "onprogress", 'move': "BALL",
          'paddle1': paddl1Y, 'paddle2': paddl2Y,
          'ballx': xBallPos, 'bally': yBallPos,
          'BallDir': BallDirection, 'BallRoute': BallRoute,
        }
        socket.ws.send(JSON.stringify(ToServer));
        // canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        // drawElements();
      }
    }

    function drawElements()
    {
      setTimeout(()=>{
      canvasContext.clearRect(0, 0, canvas.width, canvas.height);
      ballMove();
      // let Lineheight = 5;
      // while (Lineheight < 300)
      // {
      canvasContext.beginPath();
      canvasContext.lineWidth = 4;
      canvasContext.moveTo(300, 0);
      canvasContext.lineTo(300, 300);
      canvasContext.closePath();
      canvasContext.strokeStyle = "rgb(128, 9, 240)";
      canvasContext.stroke();
      //     Lineheight += 15;
      // }
        
      canvasContext.beginPath();
      canvasContext.arc(xBallPos, yBallPos, 10, 0, 6.20);
      canvasContext.lineWidth = 0.5;
      canvasContext.fillStyle = "#F0F8FF";
      canvasContext.fill();
      canvasContext.closePath();
      canvasContext.strokeStyle = "rgb(140, 29, 260)";
      canvasContext.stroke();
        
      canvasContext.beginPath();
      canvasContext.lineWidth = 8;
      canvasContext.moveTo(20, paddl1Y)
      canvasContext.lineTo(20, paddl1Y + 50);
      canvasContext.closePath();
      canvasContext.strokeStyle = "#F0F8FF";
      canvasContext.stroke();

      canvasContext.beginPath();
      canvasContext.lineWidth = 8;
      canvasContext.moveTo(580, paddl2Y)
      canvasContext.lineTo(580, paddl2Y + 50);
      canvasContext.closePath();
      canvasContext.strokeStyle = "#F0F8FF";
      canvasContext.stroke();
      if (isGameStarted == true)
        requestAnimationFrame(drawElements);
      });
    }

    function applyMove(e)
    {
      if (isGameStarted == true)
      {
        if (e.key == "ArrowUp" || e.key == "ArrowDown")
        {
          const ToServer =
          {
            'WhatIGiveYou': "PADDLES MOVE",
            'gameStatus': "onprogress", 'move': "",
            'paddle1': paddl1Y, 'paddle2': paddl2Y,
            'ballx': xBallPos, 'bally': yBallPos,
            'BallDir': BallDirection, 'BallRoute': BallRoute,
          }
          if (e.key == "ArrowUp")
            console.log("GO UP"), ToServer.move = "UP";
          else
            console.log("GO DOWN"), ToServer.move = "DOWN";
          socket.ws.send(JSON.stringify(ToServer));
        }
      }
    }

    document.addEventListener("keyup", applyMove);

    socket.ws.onopen = function(){
      console.log("User On Game");
    }

    socket.ws.onmessage = function(e)
    {
      const dataPars = JSON.parse(e.data)
      if (isGameStarted == false)
      {
          if (dataPars.player2.length == 0)
          {
              console.log("Player1: " + dataPars.player1);
              console.log("Player2: " + dataPars.player2)
              console.log("RoomId: " + dataPars.roomid)
              domElm1.innerHTML = "PLAYER1: " + dataPars.player1;
              domElm2.innerHTML = "PLAYER2: Wait...";
          }
          else if (dataPars.player2.length != 0)
          {
              isGameStarted = true;
              console.log("Player1: " + dataPars.player1);
              console.log("Player2: " + dataPars.player2)
              console.log("RoomId: " + dataPars.roomid)
              domElm1.innerHTML = "PLAYER1: " + dataPars.player1;
              domElm2.innerHTML = "PLAYER2: " + dataPars.player2;
              drawElements();
          }
      }
      else if (isGameStarted == true)
      {
        if (dataPars.MoveFor == "PADDLES MOVE")
        {
          if (dataPars.paddle1 <= 255 && dataPars.paddle1 >= -5)
            paddl1Y = dataPars.paddle1;
          if (dataPars.paddle2 <= 255 && dataPars.paddle2 >= -5)
            paddl2Y = dataPars.paddle2;
        }
        else
        {
          xBallPos = dataPars.Ballx, yBallPos = dataPars.Bally;
          BallDirection = dataPars.BallDir;
          BallRoute = dataPars.BallRoute;
        }
        // {
        //   // console.log("Paddle1: ", paddl1Y, " -> ", dataPars.paddle1)
        //   // console.log("Paddle2: ", paddl2Y, " -> ", dataPars.paddle2)
        //   // console.log(dataPars);
        //   clearInterval(SaveInterval);
        //   canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        //   drawElements();
        //   SaveInterval = setInterval(ballMove, 10);
        // }
      }
    }
    socket.ws.onclose = function()
    {
      isGameStarted = false;
      console.log("BYE FROM SERVER");
      window.stop();
      // clearInterval(SaveInterval);
    }
  }
  disconnectedCallback()
  {
    document.removeEventListener("keyup", this.applyDown);
  }
}












// -------------------------------------------------- LOCAL --------------------
// Pong View
export class PongLocal extends HTMLElement
{
  constructor()
  {
    super('foo');
    this.root = this.attachShadow({mode: 'open'});
  }
  connectedCallback() {
    this.setAttribute('id', 'pong-view');
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
          <button class="start-btn">START PLAYING</button>
      </div>
      <abort-btn></abort-btn>
      <confirm-msg game="pong"></confirm-msg>
    `;
    this.startBtn = this.root.querySelector('.start-btn');
    let isGameStarted = false;
    let xBallPos = 380, yBallPos = 150;
    let BallDirection = "LEFT";
    let paddl1Y = 125;
    let paddl2Y = 125;
    // let SaveInterval = 0;
    let BallRoute = "LINE";
    const canvas = this.root.querySelector('#board');
    const canvasContext = canvas.getContext('2d');
    canvasContext.shadowColor = "black";
    canvasContext.shadowBlur = 15;
    canvasContext.shadowOffsetX = 5;
    canvasContext.shadowOffsetY = 2;
    socket.ws = new WebSocket('ws://' + location.host + '/localGameWs/');

    function ballMove()
    {
        if (xBallPos <= 0 || xBallPos >= 600)
            socket.ws.send(JSON.stringify({'gameStatus': 'End'}));
        else
        {
            const ToServer =
            {
                'WhatIGiveYou': "BALL MOVE",
                'gameStatus': "onprogress", 'move': "BALL",
                'paddle1': paddl1Y, 'paddle2': paddl2Y,
                'ballx': xBallPos, 'bally': yBallPos,
                'BallDir': BallDirection, 'BallRoute': BallRoute,
            }
          socket.ws.send(JSON.stringify(ToServer));
        }
    }
    this.startBtn.addEventListener('click', start);
    function drawElements()
    {
      setTimeout(()=>{
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
        canvasContext.arc(xBallPos, yBallPos, 10, 0, 6.20);
        canvasContext.lineWidth = 0.5;
        canvasContext.fillStyle = "#F0F8FF";
        canvasContext.fill();
        canvasContext.closePath();
        canvasContext.strokeStyle = "rgb(140, 29, 260)";
        canvasContext.stroke();

        canvasContext.beginPath();
        canvasContext.lineWidth = 8;
        canvasContext.moveTo(20, paddl1Y)
        canvasContext.lineTo(20, paddl1Y + 50);
        canvasContext.closePath();
        canvasContext.strokeStyle = "#F0F8FF";
        canvasContext.stroke();
    
        canvasContext.beginPath();
        canvasContext.lineWidth = 8;
        canvasContext.moveTo(580, paddl2Y)
        canvasContext.lineTo(580, paddl2Y + 50);
        canvasContext.closePath();
        canvasContext.strokeStyle = "#F0F8FF";
        canvasContext.stroke();
        if (isGameStarted == true)
          requestAnimationFrame(drawElements);
      });
    }

    function applyMove(e)
    {
        // console.log(e.key);
        if (isGameStarted == true)
        {
          if (e.key == "ArrowUp" || e.key == "ArrowDown" || e.key == "w" || e.key == 's')
          {
            const ToServer =
            {
                'WhatIGiveYou': "PADDLES MOVE",
                'gameStatus': "onprogress", 'move': "",
                'paddle1': paddl1Y, 'paddle2': paddl2Y,
                'ballx': xBallPos, 'bally': yBallPos,
                'BallDir': BallDirection, 'BallRoute': BallRoute,
            }
            if (e.key == "ArrowUp")
                ToServer.move = "UP";
            else if (e.key == "ArrowDown")
                ToServer.move = "DOWN";
            else if (e.key == 'w')
                ToServer.move = "W";
            else if (e.key == 's')
                ToServer.move = "S";
            socket.ws.send(JSON.stringify(ToServer));
          }
        }
    }

    function start()
    {
      isGameStarted = true;
      // SaveInterval = setInterval(drawElements, 5);
      drawElements();
    }

    document.addEventListener("keydown", applyMove);

    socket.ws.onopen = function()
    {
        console.log("User On Game");
    }

    socket.ws.onmessage = function(e)
    {
        const dataPars = JSON.parse(e.data)
        if (dataPars.MoveFor == "PADDLES MOVE")
        {
          cancelAnimationFrame(drawElements);
          if (dataPars.paddle1 <= 255 && dataPars.paddle1 >= -5)
            paddl1Y = dataPars.paddle1;
          if (dataPars.paddle2 <= 255 && dataPars.paddle2 >= -5)
            paddl2Y = dataPars.paddle2;
        }
        else
        {
          xBallPos = dataPars.Ballx, yBallPos = dataPars.Bally;
          BallDirection = dataPars.BallDir;
          BallRoute = dataPars.BallRoute;
        }
    }

    socket.ws.onclose = function()
    {
        isGameStarted = false;
        console.log("BYE FROM SERVER");
        window.stop();
        // clearInterval(SaveInterval);
    }
  }
  disconnectedCallback()
  {
    document.removeEventListener("keyup", this.applyDown);
  }
}

// Setting View
export class Setting extends HTMLElement
{
  constructor() {
    super('foo');
    // this.root = this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.setAttribute('id', 'setting-view');
    this.setAttribute('hidden', '');
    this.innerHTML = `
      <style>
        .profile-card {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          margin: 0;
          position: relative;
        }
        .profile-card .section {
          border-radius: 20px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          padding: 20px;
          width: 500px;
          height: 350px;
          text-align: center;
          background-color: var(--teal);
          position: relative;
        }
        #float form {
          width: 500px;
          height: 350px;
          
        }
        .profile-card img {
          border-radius: 50%;
          width: 100px;
          height: 100px;
          object-fit: cover;
          position: relative;
        }
        .profile-card .edit-image {
          position: absolute;
          top: 85px;
          right: 200px;
          border: none;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          background-color: var(--peach);
          color: var(--light-olive) !important;
        }
        .profile-card .fullname {
          margin: 20px 0;
          font-size: 16px;
          color: var(--light-olive);
        }
        .profile-card p {
          margin-bottom: 10px;
          color: gray;
        }
        .profile-card .badge {
          display: inline-block;
          padding: 5px 10px;
          background: #d4f4d2;
          color: #34a853;
          border-radius: 12px;
          font-size: 12px;
          margin-bottom: 10px;
        }
        .profile-card .info {
          display: flex;
          justify-content: space-around;
          align-items: center;
          gap: 20px;
          margin: 10px 0;
        }
        .profile-card .info div {
          text-align: left;
          padding-top: 20px;
        }
        .profile-card .info div p {
          margin: 3px 0;
          font-size: 14px;
        }
        .blur
        {
          -webkit-filter: blur(10px); 
          -moz-filter: blur(10px);
          -o-filter: blur(10px);
          -ms-filter: blur(10px); 
        }
        #float
        {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 102;
          justify-content: center;
          text-align: center;
          align-items: center;
        }
        #float form
        {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          gap: 1rem;
          background: transparent;
        }
        #float form input
        {
          color: white;
          border: 2px solid var(--peach);
          border-radius: 10px;
          padding: 10px;
          background: transparent;
          width: 80%;
        }
        #float form input::placeholder
        {
          color: var(--light-olive);
        }
        .input:active {
          border: none;
          outline: none;
        }
        
        .profile-card .section .edit-btn, .save-btn
        {
          font-size: 10px;
          text-transform: uppercase;
          border: none;
          padding: 10px 40px;
          cursor: pointer;
          display: inline-block;
          border-radius: 8px;
          background-color: var(--coral);
          color: var(--light-olive);
          box-shadow: 0 0 0 3px #2f2e41, 0 6px 0 #2f2e41;
          transition: all 0.1s ease, background 0.3s ease;
          font-family: "Press Start 2P", sans-serif !important;
        }
        .save-btn
        {
          background-color: var(--dark-teal) !important;
          color: var(--light-olive) !important;
        }
        .edit-btn
        {
          height: 30px;
        }
      </style>  
      <div class="profile-card">
				<div class="section">
					<img
						src="${auth.avatar || "https://i.imgur.com/8bXZb8e.png"}"
						alt="Profile Picture"
						id="profileImage"
					/>
					<input
						type="file"
						id="fileInput"
						style="display: none"
						accept="image/*"
						onchange="changeProfileImage(event)"
						class="bx bx-pencil"
					/>
					
					<a class="edit-image"> <i class='bx bx-pencil'></i> </a>
					
					<h4 class="fullname">${auth.fullname}</h4>
					<p username="username">${auth.user}</p>
					<div class="badge">LVL 8</div>
					<div class="info">
						<div>
							<p>Name</p>
							<p class="fullname">${auth.fullname}</p>
						</div>
						<button class="edit-btn">Edit</button>
					</div>
				</div>
				<div id="float" style="display: none">
					<form action="" method="post" name="special-name">
						<input
							type="text"
							name="fullname"
							id="input-fullname"
							placeholder="Edit your name.."
							required
						/>
						<button name="Save" class="save-btn">Save</button>
					</form>
				</div>
			</div> 
    `;
    this.render();
  }
  render()
  {
    const float = this.querySelector("#float");
    const editBtn = this.querySelector(".edit-btn");
    const profileCard = this.querySelector(".profile-card .section");
    const input = this.querySelector("#input-fullname");
    const editImg = this.querySelector(".edit-image");

    editBtn.addEventListener("click", (e) => {
      profileCard.classList.add("blur");
      float.setAttribute("style", "display: flex");
      float.addEventListener("click", (e) => {
        e.preventDefault();
        if (e.target.getAttribute("name") === "Save") {
          if (input.value.length == 0) {
            // console.log("Please enter some shit");
          }
          else {
            float.setAttribute("style", "display: none");
            profileCard.classList.remove("blur");
          }
          // post data to the backend for changing the user fullname
        }
        // console.log("target: ", e.target)
        // console.log("current target: ", e.currentTarget)
        if (e.target === float)
        {
          float.setAttribute("style", "display: none");
          profileCard.classList.remove("blur");
        }
      });
    });
    // editImg.addEventListener('click', listener);
    // const listener = () => {
      
    // }
  }
}
// confirm Message component
export class ConfirmMsg extends HTMLElement
{
  constructor()
  {
    super('foor');
    this.root = this.attachShadow({ mode: 'open' });
  }
  connectedCallback()
  {
    this.setAttribute('id', 'confirm-msg')
    this.setAttribute('style', 'display: none');
    this.root.innerHTML = `
      <style>
        :host
        {
          display: block;
          width: 100%;
          height: 100%;
        }
        .wrapper
        {
          width: 100%;
          height: 100%;
          z-index: 1001;
          position: absolute;
          top: 0;
          left: 0;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .popup {
          width: 33%;
          background-color: var(--dark-purple);
          padding: 15px;
          border: none;
          border-radius: 10px;
          box-shadow: 5px 5px 5px #000;
          color: var(--light-olive);
        }
        .popup .text-right .btn-cancel
        {
          font-family: var(--body-font);
          background-color: var(--dark-teal);
          color: var(--light-olive);
          padding: 10px 20px;
          border-radius: 18px;
          border: none;
        }
        
        .popup .text-right .btn-primary
        {
          font-family: var(--body-font);
          background-color: var(--coral);
          color: var(--light-olive);
          padding: 10px 20px;
          border-radius: 18px;
          border: none;
        }
        .text-right
        {
          padding-top: 20px;
          display: flex;
          justify-content: end;
          gap: 15px;
        small{
          font-size: 10px;
        }
        }
      </style>
      <div class="wrapper">
        <div class="popup">
          <p>Sure wanna leave?</p>
          <small>You'll lose a game</small> 
          <div class="text-right">
            <button class="btn btn-cancel">Cancel</button>
            <button class="btn btn-primary">Ok</button>
          </div>
        </div>
      </div>
    `;
    const game = this.getAttribute('game');
    this.cancel = this.root.querySelector('.btn-cancel');
    this.leave  = this.root.querySelector('.btn-primary');
    
    window.onpopstate = () => {
      history.replaceState({ path: '/game' }, null, location.origin + '/game');
      // console.log(`${game} popState triggered!`);
      this.setAttribute('style', 'display: block');
    }
    this.fcancel = () => {
      // console.log("canceling");
      this.setAttribute('style', 'display: none');
    }
    this.fleave = () => {
      // console.log("leaving");
      this.setAttribute('style', 'display: none');
      console.log("whiche game would be removed: ", game);
      aborting(socket.ws, game);
      window.router.goto('/platform');
    }
    this.cancel.addEventListener("click", this.fcancel);
    this.leave.addEventListener("click", this.fleave);
  }
  disconnectedCallback()
  {
    // console.log("confirm masg removed");
    this.cancel.removeEventListener("click", this.fcancel);
    this.leave.removeEventListener("click", this.fleave);
    window.onpopstate = null;
  }
}
// Abort Game Button
export class AbortButton extends HTMLElement
{
  constructor() {
    super();
    // this.root = this.attachShadow({ mode: 'open' });
  }
  connectedCallback() {
    this.setAttribute('class', 'abort');
    this.confirm = 
    this.innerHTML = `
      <style>
        .abort {
          font-size: 14px;
          font-weight: 300;
          text-transform: uppercase;
          letter-spacing: 1px;
          border: none;
          cursor: pointer;
          display: inline-block;
          cursor: pointer;
          padding: 10px 60px;
          border-radius: 8px;
          background-color: var(--coral);
          color: var(--peach);
          box-shadow: 0 0 0 3px #2f2e41, 0 6px 0 #2f2e41;
          transition: all 0.1s ease, background 0.3s ease;
          font-family: "Press Start 2P", sans-serif !important;
        }
      </style>
      EXIT
    `;
    const parent = this.parentNode;
    const confirmMsg = parent.querySelector('confirm-msg');
    this.cancel = confirmMsg.querySelector(".btn-cancel");
    this.leave = confirmMsg.querySelector(".btn-primary");
    this.listener = () => {
      confirmMsg.setAttribute('style', 'display: block');
    }
    this.addEventListener('click', this.listener);
  }
}
// Main UI View
export class MainUI extends HTMLElement
{
    constructor()
    {
        super('foo');
    }
    connectedCallback()
    {
        const home      = document.createElement("home-view");
        const left      = document.createElement("div");
        const right     = document.createElement("div");
        const middle    = document.createElement("div");
        const chat      = document.createElement("chat-view");
        const game      = document.createElement("game-view");
        const sidebar   = document.createElement("sidebar-view");
        const profile   = document.createElement("profile-view");
        const setting   = document.createElement("setting-view");
        const platform  = document.createElement("platform-view");

        this.setAttribute("id", "main-ui");
        left.setAttribute("id", "left-view");
        left.setAttribute("hidden", '');
        right.setAttribute("id", "right-view");
        right.setAttribute("hidden", '');
        middle.setAttribute("id", "middle-view");
        middle.setAttribute("hidden", '');

        right.appendChild(chat);
        left.appendChild(sidebar);

        middle.appendChild(game);
        middle.appendChild(profile);
        middle.appendChild(setting);
        middle.appendChild(platform);
        
        
        this.appendChild(home);
        this.appendChild(left);
        this.appendChild(middle);
        this.appendChild(right);
    }
}