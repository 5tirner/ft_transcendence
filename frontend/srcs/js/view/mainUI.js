import { auth } from '../auth/Authentication.js';
import API from '../service/API.js';
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
        console.log("clicked");
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
                    <a href="/game" export class="nav_link">
                        <i export class="bx bxs-invader nav_icon"></i>
                    </a>
                    <a href="/setting" export class="nav_link">
                        <i export class="bx bxs-cog nav_icon"></i>
                    </a>
                    <a href="/" export class="nav_link">
                        <i export class="bx bx-log-out nav_icon"></i>
                    </a>
                </div>
				<a href="/profile" export class="nav_link">
					<i export class="bx bx-user nav_icon"></i>
				</a>
			</nav>
        `;
        this.doSomeThing();
    }
    // skipcq: JS-0105
    doSomeThing()
    {
        const arr = this.querySelectorAll("a");
        arr.forEach(elem => {
            // skipcq: JS-0002
            elem.addEventListener("click", (e) => {
                e.preventDefault();
                const href = e.currentTarget.getAttribute("href");
                console.log("That fyp")
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
                <ttt-view></ttt-view>
                <pong-view></pong-view>
			</div>
        `;
        if ( document.fullscreenEnabled )
        {
            const button = this.querySelector("button");
            button.addEventListener("click", toggleFscreen);
        }
        function toggleFscreen()
        {
            console.log("clicked: ", document.body.getAttribute("fullscreen"));
            if (document.body.getAttribute("fullscreen") === null) {
                document.body.setAttribute("fullscreen","");
                window.component.left.setAttribute('hidden', '');
                window.component.right.setAttribute('hidden', '');
                window.component.middle.setAttribute('style', "flex-basis: 100%");
            } else {
                document.body.removeAttribute("fullscreen");
                window.component.left.removeAttribute('hidden');
                window.component.right.removeAttribute('hidden');
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
            .local
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
        </style>
        <div class="container">
            <div class="wrapper">
                <div class="pong">
                    <img src="js/view/src/img/pong.gif">
                    <div class="btn-wrapper">
                        <button class="button multi">Multiplayer</button>
                        <button class="button local">Local</button>
                    </div>
                </div>
                <div class="xo">
                    <img src="js/view/src/img/xo-teal.gif">
                    <div class="btn-wrapper">
                      <a href="/game" class="button xo-btn multi" game="ttt">
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
        const ticTacToe = this.root.querySelector(".xo-btn");
        ticTacToe.addEventListener("click", (e) => {
          e.preventDefault();
          const tictacRes = API.getTicTacToe();
          console.log(tictacRes);
          const href = ticTacToe.getAttribute("game");
          if ( href === "ttt" )
          {
            window.router.goto("/game");
            if (!customElements.get("ttt-view"))
              customElements.define("ttt-view", TTT);
            document.querySelector("#ttt-view").removeAttribute("hidden");
          }
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
    connectedCallback()
    {
      this.setAttribute('id', 'ttt-view');
      // this.setAttribute('hidden', '');
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
      `;
      const domElm1 = this.root.getElementById("p1"); 
      const domElm2 = this.root.getElementById("p2");
      const square = this.root.querySelectorAll(".square");
      square.forEach(elem => {
        elem.addEventListener('click', (e) => {
          e.preventDefault();
          console.log(e.target.getAttribute('data'));
          sendDataToServer(e.target.getAttribute('data'));
        });
      });

      const ws = new WebSocket('ws://' + location.host + '/GameWS/');
      let board = '.........';
      let isGameStarted = false;

      function isGameEnd(x_o, board)
      {
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
      ws.onopen = function()
      {
        console.log("User On Game");
      }

      ws.onmessage = (e) =>
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
            }
        }
        else
        {
          if (dataPars.etat == "PLAYING")
          {
            console.log('Game Is Started');
            console.log(e.data);
            board = dataPars.board;
            const position = dataPars.position;
            const domElem = this.root.getElementById(`square${position}`);
            if (dataPars.x_o == "X")
            {
              domElem.innerHTML = "X";
              domElem.classList.add("squareX");
            }
            else if (dataPars.x_o == "O")
            {
              domElem.innerHTML = "O";
              domElem.classList.add("squareO");
            }
            if (isGameEnd(dataPars.x_o, board) == true)
            {
              console.log("Setting The Result Of This Game On Data Base");
              const toServer = {'gameStatus': "winner", 'position': -1, 'board': board};
              ws.send(JSON.stringify(toServer));
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
        else
        {
          const toServer = {'gameStatus': "onprogress", 'position': position, 'board': board};
          ws.send(JSON.stringify(toServer));
        }
      }
      else
          console.log('Game Not Start Yet');
      }
      ws.onclose  = function()
      {
          console.log("BYE FROM SERVER");
      }
      window.onbeforeunload = function()
      {
        const toServer = {'gameStatus': "closed", 'position': -1, 'board': board};
        ws.send(JSON.stringify(toServer));
      }
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