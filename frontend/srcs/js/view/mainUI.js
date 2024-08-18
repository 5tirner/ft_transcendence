import { auth } from "../auth/Authentication.js";
import { aborting } from "../assets/abort.js";
import { ChatComponent } from "./chat/chat.js";
const socket = {
	ws: null
};
// Login View
export class Login extends HTMLElement {
	constructor() {
		super();
		this.root = this.attachShadow({ mode: "open" });
	}
	connectedCallback() {
		this.setAttribute("id", "login-view");
		this.setAttribute("hidden", "");
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
		this.root.querySelector(".bluer").addEventListener("click", () => {
			this.setAttribute("hidden", "");
		});
		const links = this.root.querySelectorAll("a");
		links.forEach((link) => {
			link.addEventListener("click", (e) => {
				e.preventDefault();
				window.Auth.loginIntra();
			});
		});
	}
	// onclick="window.Auth.loginIntra()"
	// onclick="window.Auth.loginGoogle()"
}
// Home View
export class Home extends HTMLElement {
	constructor() {
		super();
	}
	connectedCallback() {
		this.setAttribute("id", "home-view");
		this.setAttribute("hidden", "");
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
	anchors() {
		const links = this.querySelectorAll("a");
		links.forEach((link) => {
			link.addEventListener("click", (e) => {
				e.preventDefault();
				// console.log("clicked");
				this.querySelector("login-view").removeAttribute("hidden");
			});
		});
	}
}
// Sidebar View
export class Sidebar extends HTMLElement {
	constructor() {
		super();
	}
	// skipcq: JS-0057
	connectedCallback() {
		this.setAttribute("id", "sidebar-view");

		this.innerHTML += `
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
                    <a href="/history" class="nav_link">
                      <i class='bx bx-history nav_icon'></i>
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
	doSomeThing() {
		const arr = this.querySelectorAll("a");
		arr.forEach((elem) => {
			elem.addEventListener("click", (e) => {
				e.preventDefault();
				const href = e.currentTarget.getAttribute("href");
				if (href === "/profile") {
					const component = document.querySelector("#TheStat");
					const holder = document.querySelector("#components-holder");
					if (component) component.remove();
					holder.appendChild(document.createElement("stat-ics"));
				}
				if (href === "/history") {
					const component = document.querySelector("#TheHistory");
					const holder = document.querySelector("#middle-view");
					if (component) component.remove();
					holder.appendChild(document.createElement("history-view"));
				}
				window.router.goto(href);
			});
		});
	}
}
// Game View
export class Game extends HTMLElement {
	constructor() {
		super();
	}
	connectedCallback() {
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

		if (document.fullscreenEnabled) {
			const button = this.querySelector("button");
			button.addEventListener("click", toggleFscreen);
		}
		function toggleFscreen() {
			// console.log("clicked: ", document.body.getAttribute("fullscreen"));
			if (document.body.getAttribute("fullscreen") === null) {
				document.body.setAttribute("fullscreen", "");
				window.component.middle.setAttribute(
					"style",
					"flex-basis: 100%"
				);
			} else {
				document.body.removeAttribute("fullscreen");
				window.component.middle.removeAttribute("style");
			}
		}
	}
}
// User Profile View
export class Profile extends HTMLElement {
	constructor() {
		super();
		// this.root = this.attachShadow({ mode: "open" });
	}
	// connected call back
	connectedCallback() {
		this.setAttribute("id", "profile-view");
		this.setAttribute("hidden", "");
		this.innerHTML = `
        <style>
        .user-info {
            background-color: var(--dark-purple);
            color: var(--light-olive);
            margin: 3rem auto;
            padding: 3rem;
            border-radius: 10px;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
            max-width: 800px;
            display: flex;
            align-items: center;
        }
        
        .user-info .avatar {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            margin-right: 2rem;
            border: 3px solid #4CAF50;
        }
        
        .user-info .info {
            flex: 1;
        }
        
        .user-info p {
          font-size: 16px;
          margin: 0.5rem 0;
        }
        
        .progress-bar {
            background-color: #e0e0e0;
            border-radius: 10px;
            overflow: hidden;
            margin-top: 1rem;
            margin-bottom: 0.5rem;
            height: 25px;
        }
        
        .progress {
            background-color: #4CAF50;
            height: 100%;
            width: 0;
        }
        
        .progress-text {
            margin: 0;
            font-size: 1rem;
        }
        
        </style>
        <!-- <div class="first">
          <div class="win common">Win Count: ${auth.wins}</div>
          <div class="user common">
              <div class="avatar">
                <img src="${auth.avatar}" alt="" />
              </div>
              <div class="fullname info">${auth.fullname}</div>
              <div class="username info">@${auth.user}</div>
          </div>
          <div class="loss common">Loss Count: ${auth.loses}</div>
        </div> -->
        <section class="user-info">
          <img src="${auth.avatar}" alt="User Avatar" class="avatar">
          <div class="info">
              <p><strong>Username:</strong> ${auth.user}</p>
              <p><strong>Fullname:</strong> ${auth.fullname}</p>
              <div class="progress-bar">
                  <div class="progress" style="width: 70%;"></div>
              </div>
              <p class="progress-text">Experience: 70%</p>
          </div>
        </section>
        <div id="components-holder"></div>
        <!-- <tic-tac-toe-stat></tic-tac-toe-stat> -->
      `;
	}
}
// Statistics Component
export class Stats extends HTMLElement {
	constructor() {
		super();
		this.root = this.attachShadow({ mode: "open" });
	}
	async connectedCallback() {
		this.setAttribute("id", "TheStat");
		this.setAttribute("game", "Tic-Tac-Toe");
		const ticData = await auth.getTicStat();
		const pigData = await auth.getPongStat();
		this.root.innerHTML = `
      <style>
        .stats {
          background-color: var(--dark-purple);
          color: var(--light-olive);
          margin: 2rem auto;
          padding: 1rem;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          max-width: 600px;
          padding: 50px 80px;
        }
        
        .user-info h2, .stats h2 {
            margin-top: 0;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
        }
        
        th, td {
            padding: 0.5rem;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        
        th {
            // background-color: #f2f2f2;
        }
        
        tr:hover {
            background-color: #f1f1f1;
            color: var(--dark-purple)
        }
        .flexing
        {
          width: 100%;
          display: flex;
          flex-direction: row;
        }
      </style>
      <div class="flexing">
        <section class="stats">
            <h4>Pong Stats</h4>
            <table>
                <thead>
                    <tr>
                        <th>Stat</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Games Played</td>
                        <td>${pigData.gamesPlayed}</td>
                    </tr>
                    <tr>
                        <td>Wins</td>
                        <td>${pigData.wins}</td>
                    </tr>
                    <tr>
                        <td>Losses</td>
                        <td>${pigData.loses}</td>
                    </tr>
                    <tr>
                        <td>Draw</td>
                        <td>${pigData.draws}</td>
                    </tr>
                    <tr>
                        <td>Total Points</td>
                        <td>13200</td>
                    </tr>
                </tbody>
            </table>
        </section>
        <section class="stats">
            <h4>Tic-Tac-Toe Stats</h4>
            <table>
                <thead>
                    <tr>
                        <th>Stat</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Games Played</td>
                        <td>${ticData.gamesPlayed}</td>
                    </tr>
                    <tr>
                        <td>Wins</td>
                        <td>${ticData.wins}</td>
                    </tr>
                    <tr>
                        <td>Losses</td>
                        <td>${ticData.loses}</td>
                    </tr>
                    <tr>
                        <td>Draw</td>
                        <td>${ticData.draws}</td>
                    </tr>
                    <tr>
                        <td>Total Points</td>
                        <td>13200</td>
                    </tr>
                </tbody>
            </table>
        </section>
      </div>
    `;
	}
}
// Game History
export class Histo extends HTMLElement {
	constructor() {
		super();
		this.root = this.attachShadow({ mode: "open" });
	}
	async connectedCallback() {
		this.setAttribute("id", "TheHistory");
		this.setAttribute("hidden", "");
		const ticData = await auth.getTicHisto();
		const pongData = await auth.getPongHisto();
		this.root.innerHTML = `
      <style>
        .wrapper
        {
          display: flex;
          gap: 50px;
          width: 90%;
        }
        .container {
            background: var(--dark-purple);
            color: var(--light-olive);
            padding: 40px;
            border-radius: 24px;
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
            width: 90%;
            max-width: 1000px;
            text-align: left;
            position: relative;
            width: 100%;
            overflow-y: scroll;
        }
        .container::-webkit-scrollbar {
            display: none;
        }
        
        h1 {
            color: var(--light-olive);
            margin-bottom: 20px;
            font-size: 24px;
            font-weight: 500;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        
        th, td {
            padding: 15px 20px;
            text-align: left;
            font-size: 14px;
            color: #666;
        }
        
        th {
            background: var(--dark-purple);
            color: var(--light-olive);
            border-bottom: 2px solid #eee;
        }
        
        tbody tr {
            background: var(--dark-purple);
            color: var(--light-olive);
            transition: background-color 0.3s;
        }
        
        tbody tr td
        {
          color: var(--light-olive);
        }
        
        .highlight {
            background-color: #f0f8ff;
            font-weight: bold;
            border-radius: 8px;
            position: relative;
        }

        .opponent {
            display: flex;
            align-items: center;
        }
        
        .opponent img {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            margin-right: 10px;
        }
        .win
        {
          color: var(--teal);
        }
        .lose
        {
          color: var(--coral);
        }
      </style>
      <div class="wrapper">
        <div class="container">
          <h1>Tic-Tac-Toe History</h1>
          <table>
              <thead>
                  <tr>
                      <th>Opponent</th>
                      <th>Result</th>
                      <th>Score</th>
                  </tr>
              </thead>
              <tbody class="tttInjectHere">
              </tbody>
          </table>
        </div>
        
        <div class="container">
          <h1>Pong Match History</h1>
          <table>
              <thead>
                  <tr>
                      <th>Opponent</th>
                      <th>Result</th>
                      <th>Score</th>
                  </tr>
              </thead>
              <tbody class="pongInjectHere">
              </tbody>
          </table>
        </div>
      </div>
    `;
		const tttInjectHere = this.root.querySelector(".tttInjectHere");
		const pongInjectHere = this.root.querySelector(".pongInjectHere");
		const createHistoElem = (data) => {
			const parsed = JSON.parse(data);
			let elem = "";
			if (Object.keys(parsed).length == 0) {
				elem = `
          <tr>
            <td colspan="5" style="text-align:center; color: var(--light-olive); padding: 20px; border-radius: 8px;">
              No Matches Played Yet!
            </td>
          </tr>
        `;
			} else {
				let result = "";
				let what = "";
				for (const [key, value] of Object.entries(parsed)) {
					console.log("key: ", key);
					console.log("value: ", value);

					if (value.winner === value.oppenent) result = "lose";
					else result = "win";
					elem += `
          <tr>
            <td class="opponent">
              <img src="${value.pic || "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"}" alt="avatar">
              ${value.oppenent}
            </td>
            <td class="${result}">
              ${result}
            </td>
          </tr>`;
				}
			}
			return elem;
		};
		tttInjectHere.innerHTML = createHistoElem(ticData);
		pongInjectHere.innerHTML = createHistoElem(pongData);
	}
}
// Pong animation
export class PongAnimation extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    const title = this.getAttribute("title");
    this.root.innerHTML = `
      <style>
        :host {
          display: flex;
          width: 100%;
          height: 100%;
          justify-content: center;
          align-items: center;
        }
        .pong-container {
          position: relative;
          margin: 0 auto;
          width: 75%;
          height: 75%;
          color: var(--light-olive);
        }
        
        .paddle-left, .paddle-right {
          position: absolute;
          width: 5px;
          height: 40px;
          background-color: white;
        }
        
        .paddle-left {
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          animation: movePaddleLeft 2s infinite alternate ease-in-out;
        }
        
        .paddle-right {
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          animation: movePaddleRight 2s infinite alternate ease-in-out;
        }
        
        .ball {
          position: absolute;
          width: 12px;
          height: 12px;
          background-color: white;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: moveBall 4s infinite linear;
        }
        
        @keyframes movePaddleLeft {
          0% { top: 30%; }
          100% { top: 70%; }
        }
        
        @keyframes movePaddleRight {
          0% { top: 70%; }
          100% { top: 30%; }
        }
        
        @keyframes moveBall {
          0%, 100% { left: 10%; top: 30%; }
          25% { left: 90%; top: 50%; }
          50% { left: 10%; top: 70%; }
          75% { left: 90%; top: 50%; }
        }
      </style>
      <div class="pong-container">
        <div class="title">${title}</div>
        <div class="paddle-left"></div>
        <div class="paddle-right"></div>
        <div class="ball"></div>
      </div>
    `
  }
}
// Tic-Tac-Toe Animation
export class TicTacToeAnimation extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    const title = this.getAttribute("title");
    this.root.innerHTML = `
      <style>
        .tic-tac-toe-container {
            display: grid;
            grid-template-columns: repeat(3, 60px);
            grid-template-rows: repeat(3, 60px);
            gap: 5px;
            margin-top: 20px;
        }
        
        .cell {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 18px;
            font-weight: bold;
            color: var(--light-olive);
            position: relative;
            overflow: hidden;
        }
        
        .x-swing, .o-swing {
            animation: swing 2s infinite ease-in-out;
        }
        
        @keyframes swing {
            0% { transform: rotate(0deg); }
            25% { transform: rotate(15deg); }
            50% { transform: rotate(0deg); }
            75% { transform: rotate(-15deg); }
            100% { transform: rotate(0deg); }
        }
      </style>
      <div>${title}</div>
      <div class="tic-tac-toe-container">
        <div class="cell">
            <div class="x-swing">X</div>
        </div>
        <div class="cell">
            <div class="o-swing">O</div>
        </div>
        <div class="cell">
            <div class="x-swing">X</div>
        </div>
        <div class="cell">
            <div class="o-swing">O</div>
        </div>
        <div class="cell">
            <div class="x-swing">X</div>
        </div>
        <div class="cell">
            <div class="o-swing">O</div>
        </div>
        <div class="cell">
            <div class="x-swing">X</div>
        </div>
        <div class="cell">
            <div class="o-swing">O</div>
        </div>
        <div class="cell">
            <div class="x-swing">X</div>
        </div>
    </div>
    `
  }
}
// Platform View
export class Platform extends HTMLElement {
	constructor() {
		super();
		this.root = this.attachShadow({ mode: "open" });
	}
	connectedCallback() {
		this.setAttribute("id", "platform-view");
		this.setAttribute("hidden", "");
		this.root.innerHTML += `
    <style>
      a
      {
          text-decoration: none;
      }
      .container
      {
        width: 100%;
        height: 50%;
      }
      .wrapper
      {
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        width: 80%;
        height: 80%;
      }
      .pong, .xo, .tour
      {
        display: flex;
        align-items: center;
        width: 330px;
        position: relative;
        background-color: var(--dark-purple);
        
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
        border-radius: 12px;
      }
      .pong
      {
        
        text-align: center;
        justify-content: center;
        
      }
      .xo
      {
        flex-direction: column;
        padding-top: 45px;
        color: var(--light-olive);
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
          animation: 20s sliding infinite linear;
      }
      @media screen and (max-width: 1300px) {
        .container {
          // width: 100%;
          // height: 35%;
          // display: flex;
          // flex-direction: column;
          // justify-content: center;
          // align-items: center;
        }
        .wrapper
        {
          display: flex;
          flex-direction: column;
          align-items: center;
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
                <pong-animation title="PONG"></pong-animation>
                <div class="btn-wrapper">
                  <a href="/game" class="button po-btn multi common" game="pong">
                    Multiplayer
                  </a>
                  <button class="button po-local">Local</button>
                </div>
            </div>
            <div class="xo">
              <tic-tac-toe-anim title="TIC TAC TOE"></tic-tac-toe-anim>
              <div class="btn-wrapper">
                  <a href="/game" class="button xo-btn multi common" game="ttt">
                    Multiplayer
                  </a>
              </div>
            </div>
            <div class="tour">
                <pong-animation title="PONG TOURNAMENT"></pong-animation>
                <div class="btn-wrapper">
                <a href="/game" class="button po-btn-tour multi common" game="tournament">
                  Tournament
                </a>
                </div>
            </div>
        </div>
    </div>
    <!-- <div class="rank">
        <div class="rank-title">Players Rank</div>
        <div class="slide">
            
        </div> -->
    </div>
    `;
		this.startGame = this.root.querySelectorAll(".common");
		this.poLocal = this.root.querySelector(".po-local");
		this.startGame.forEach((elem) => {
			elem.addEventListener("click", (e) => {
				e.preventDefault();
				const game = e.target.getAttribute("game");
				manipulateGameSection(game);
			});
		});
		const manipulateGameSection = (gameToAppend) => {
			const gameSection = document.querySelector(".game-section");
			const gameElem = document.querySelector(`#${gameToAppend}-view`);
			if (gameElem !== null) gameElem.remove();
			else
				gameSection.appendChild(
					document.createElement(`${gameToAppend}-view`)
				);
			window.router.goto("/game");
		};
		this.poLocal.addEventListener("click", () =>
			manipulateGameSection("po-local")
		);
		window.onpopstate = (e) => {
			window.router.goto(e.state.path);
		};

		const renderPlayersCard = () => {
			// get number of rankder player from database and based on the number create components sma3ti
			const slider = this.root.querySelector(".slide");
			const card = document.createElement("rank-pl");
		};
	}

	disconnectedCallback() {
		this.startGame.forEach((elem) => {
			elem.removeEventListener("click", (e) => {
				e.preventDefault();
				const game = e.target.getAttribute("game");
				manipulateGameSection(game);
			});
		});
	}
}

export class Pong2 extends HTMLElement {
	constructor() {
		super();
		this.root = this.attachShadow({ mode: "open" });
	}

	connectedCallback() {
		this.render();
		this.initializeGame();
		this.setupWebSocket();
	}

	disconnectedCallback() {
		document.removeEventListener("keyup", this.applyMove);
		if (this.saveInterval) clearInterval(this.saveInterval);
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
              color: #421152;
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
      <confirm-msg game="pong"></confirm-msg>
    `;
	}
	
	setupWebSocket()
	{
		socket.ws = new WebSocket("ws://" + location.host + "/PongGameWs/");

		socket.ws.onopen = () => console.log("Connected to Game Server");
		socket.ws.onmessage = (e) => this.handleServerMessage(e);
		socket.ws.onclose = () => {
			this.isFinished = true;
			this.isGameStarted = false;
			console.log("Disconnected from Game Server");
		};

		document.addEventListener("keyup", (e) => this.applyMove(e));
	}
	
	initializeGame() {
		this.canvas = this.root.querySelector("#board");
		this.ctx = this.canvas.getContext("2d");
		this.domPlayer1 = this.root.querySelector("#p1");
		this.domPlayer2 = this.root.querySelector("#p2");

		this.isGameStarted = false;
		this.isFinished = false;
		this.ballPos = { x: 280, y: 150 };
		this.ballDirection = "LEFT";
		this.paddle1Y = 125;
		this.paddle2Y = 125;
		this.ballRoute = "LINE";
	}

	handleServerMessage(event) {
		const data = JSON.parse(event.data);

		if (!this.isGameStarted && !this.isFinished) {
			this.handleGameStart(data);
		} else if (this.isGameStarted && !this.isFinished) {
			this.updateGameState(data);
		}
	}

	handleGameStart(data) {
		if (!data.player2) {
			this.domPlayer1.textContent = `PLAYER1: ${data.player1}`;
			this.domPlayer2.textContent = "PLAYER2: Wait...";
		} else {
			this.isGameStarted = true;
			this.domPlayer1.textContent = `PLAYER1: ${data.player1}`;
			this.domPlayer2.textContent = `PLAYER2: ${data.player2}`;
			this.saveInterval = setInterval(() => this.drawElements(), 70);
		}
	}

	updateGameState(data) {
		if (data.MoveFor === "PADDLES MOVE") {
			this.paddle1Y = this.clamp(data.paddle1, -5, 255);
			this.paddle2Y = this.clamp(data.paddle2, -5, 255);
		} else {
			this.ballPos.x = data.Ballx;
			this.ballPos.y = data.Bally;
			this.ballDirection = data.BallDir;
			this.ballRoute = data.BallRoute;
		}
	}

	clamp(value, min, max) {
		return Math.min(Math.max(value, min), max);
	}

	applyMove(event) {
		if (!this.isGameStarted || this.isFinished) return;

		let moveDirection = "";

		if (event.key === "ArrowUp") {
			moveDirection = "UP";
		} else if (event.key === "ArrowDown") {
			moveDirection = "DOWN";
		}

		if (moveDirection) {
			socket.ws.send(
				JSON.stringify({
					WhatIGiveYou: "PADDLES MOVE",
					gameStatus: "onprogress",
					move: moveDirection,
					paddle1: this.paddle1Y,
					paddle2: this.paddle2Y,
					ballx: this.ballPos.x,
					bally: this.ballPos.y,
					BallDir: this.ballDirection,
					BallRoute: this.ballRoute
				})
			);
		}
	}

	drawElements() {
		if (!this.isGameStarted || this.isFinished) return;

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.drawBall();
		this.drawPaddles();
	}

	drawBall() {
		this.ctx.beginPath();
		this.ctx.arc(this.ballPos.x, this.ballPos.y, 10, 0, 2 * Math.PI);
		this.ctx.fillStyle = "#F0F8FF";
		this.ctx.fill();
		this.ctx.strokeStyle = "#8C1DD4";
		this.ctx.stroke();
	}

	drawPaddles() {
		this.drawPaddle(20, this.paddle1Y);
		this.drawPaddle(580, this.paddle2Y);
	}

	drawPaddle(x, y) {
		this.ctx.beginPath();
		this.ctx.moveTo(x, y);
		this.ctx.lineTo(x, y + 50);
		this.ctx.lineWidth = 8;
		this.ctx.strokeStyle = "#F0F8FF";
		this.ctx.stroke();
	}
}
// Rank players
export class RankPlayers extends HTMLElement {
	constructor() {
		super();
		this.root = this.attachShadow({ mode: "open" });
	}
	connectedCallback() {
		this.root.innerHTML = `
      <style>
        .avatar {
            width: 110px;
            height: 110px;
        }
        .avatar img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
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
      </style>
      <div class="rank-card">
          <div class="avatar">
              <img src="${auth.avatar}" alt="avatar">
          </div>
          <div class="name">${auth.fullname}</div>
          <div class="points">${auth.wins} wins</div>
      </div>
    `;
	}
}
export class ResultMsg extends HTMLElement {
	constructor() {
		super();
		this.root = this.attachShadow({ mode: "open" });
	}
	connectedCallback() {
		this.root.innerHTML = `
    <style>
      .container {
          backdrop-filter: blur(5px);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: row;
      }
      
      .player {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
      }
      
      .winner {
      }
      
      .loser {
      }
      
      .avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          margin-right: 15px;
          margin-bottom: 10px;
      }
      
      .info h2 {
        margin: 0 0 10px 0;
        color: #333;
      }
      
      .info .result {
        margin: 0;
        color: #555;
      }
      
      .home-button {
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
          background-color: var(--teal);
          color: var(--light-olive);
          text-decoration: none;
          box-shadow: 0 0 0 3px #2f2e41, 0 6px 0 #2f2e41;
          transition: all 0.1s ease, background 0.3s ease;
          font-family: "Press Start 2P", sans-serif !important;
          position: absolute;
          left: 50%;
          bottom: 220px;
          transform: translate(-50%, 0);
      }
      
      .home-button:hover {
            background-color: #0056b3;
        }
        
        @media (max-width: 768px) {
            .player {
                width: 100%;
                max-width: 400px;
            }
        }
        
        @media (max-width: 480px) {
            .player {
                flex-direction: column;
                width: 100%;
                max-width: none;
            }
        
            .avatar {
                margin-right: 0;
                margin-bottom: 10px;
            }
        
            .container {
                padding: 10px;
            }
        
            .home-button {
                width: 100%;
                box-sizing: border-box;
            }
        }
      </style>
      <div class="container">
        <div class="player winner">  
          <img src="https://avatar.iran.liara.run/public" alt="Winner Avatar" class="avatar">
            <div class="info">
                <h2>Winner</h2>
                <p class="result">Congratulations! You won!</p>
            </div>
        </div>
        <a href="/paltform" class="home-button">Back</a>
        <div class="player loser">
            <img src="https://avatar.iran.liara.run/public" alt="Loser Avatar" class="avatar">
            <div class="info">
                <h2>Loser</h2>
                <p class="result">Better luck next time!</p>
            </div>
        </div>
    </div>
    `;
		const game = this.getAttribute("game");
		const returnHome = this.root.querySelector(".home-button");
		returnHome.addEventListener("click", (e) => {
			e.preventDefault();
			aborting(socket.ws, game);
		});
	}
	disconnectedCallback() {}
}
// TicTacToe View
export class TTT extends HTMLElement {
	constructor() {
		super();
		this.root = this.attachShadow({ mode: "open" });
	}
	connectedCallback() {
		this.setAttribute("id", "ttt-view");
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
      <div class="result"></div>
    `;

		const domElm1 = this.root.getElementById("p1");
		const domElm2 = this.root.getElementById("p2");
		this.square = this.root.querySelectorAll(".square");
		this.result = this.root.querySelector(".result");

		this.square.forEach((elem) => {
			elem.addEventListener("click", (e) => {
				e.preventDefault();
				sendDataToServer(e.target.getAttribute("data"));
			});
		});

		this.square.forEach((elem) => {
			elem.addEventListener("click", (e) => {
				e.preventDefault();
				sendDataToServer(e.target.getAttribute("data"));
			});
		});

		socket.ws = new WebSocket("ws://" + location.host + "/GameWS/");
		let board = ".........";
		let isGameStarted = false;

		function isGameEnd(x_o, board) {
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

		socket.ws.onopen = function () {
			// console.log("User On Game");
		};

		socket.ws.onmessage = (e) => {
			const dataPars = JSON.parse(e.data);
			if (isGameStarted == false) {
				if (dataPars.player2.length == 0) {
					// console.log("Player1: " + dataPars.player1);
					// console.log("Player2: " + dataPars.player2)
					// console.log("RoomId: " + dataPars.roomid)

					domElm1.innerHTML = "PLAYER1: " + dataPars.player1;
					domElm2.innerHTML = "PLAYER2: Wait...";
				} else if (dataPars.player2.length != 0) {
					isGameStarted = true;
					// console.log("Player1: " + dataPars.player1);
					// console.log("Player2: " + dataPars.player2)
					// console.log("RoomId: " + dataPars.roomid)
					domElm1.innerHTML = "PLAYER1: " + dataPars.player1;
					domElm2.innerHTML = "PLAYER2: " + dataPars.player2;
				}
			} else {
				if (dataPars.etat == "PLAYING") {
					// console.log('Game On Progress');
					// console.log(e.data);
					board = dataPars.board;
					const position = dataPars.position;
					const domElem = this.root.getElementById(
						`square${position}`
					);
					if (dataPars.x_o == "X") {
						domElem.innerHTML = "X";
						domElem.classList.add("squareX");
					} else if (dataPars.x_o == "O") {
						domElem.innerHTML = "O";
						domElem.classList.add("squareO");
					}
					// // console.log("Index", board.indexOf("."),  "->" , board[board.indexOf(".")]);
					if (isGameEnd(dataPars.x_o, board) == true) {
						// console.log("Setting The Result Of This Game On Data Base");
						const toServer = {
							gameStatus: "winner",
							position: -1,
							board: board,
							winner: dataPars.user,
							loser: dataPars.oppenent
						};
						socket.ws.send(JSON.stringify(toServer));
					} else if (board.indexOf(".") == -1) {
						// console.log("Setting The Result Of This Game On Data Base");
						const toServer = {
							gameStatus: "draw",
							position: -1,
							board: board
						};
						socket.ws.send(JSON.stringify(toServer));
					}
				}
			}
		};

		function sendDataToServer(squareNbr) {
			if (isGameStarted == true) {
				const position = Number(squareNbr);
				if (board[position] != ".")
					console.log(
						"The Square Already Filled By: ",
						board[position]
					);
				else {
					const toServer = {
						gameStatus: "onprogress",
						position: position,
						board: board
					};
					socket.ws.send(JSON.stringify(toServer));
				}
			} else console.log("Game Not Start Yet");
		}
		socket.ws.onclose = () => {
			console.log("Socket closed BYE BYE");
			const resultComp = document.createElement("result-msg");
			resultComp.setAttribute("game", "ttt");
			this.result.appendChild(resultComp);
		};
		window.onbeforeunload = function () {
			aborting(socket.ws, "ttt");
		};
	}
	disconnectedCallback() {
		this.square.forEach((elem) => {
			elem.removeEventListener("click", (e) => {
				e.preventDefault();
				sendDataToServer(e.target.getAttribute("data"));
			});
		});
	}
}
// Pong View
export class Pong extends HTMLElement {
	constructor() {
		super();
		this.root = this.attachShadow({ mode: "open" });
	}
	
	connectedCallback() {
		// this.setAttribute("id", "pong-view");
		this.render();
		this.initializeGame();
		this.setupWebSocket();
	}
	
	disconnectedCallback()
	{
  	document.removeEventListener("keyup", this.applyMove);
	}
	
	drawElements()
	{
		if (this.isGameStarted == true && this.isFinsih == false ) {
			this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
              color: #421152;
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
      <confirm-msg game="pong"></confirm-msg>
    `;
	}
	
	initializeGame()
	{
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
	}
	
	setupWebSocket()
	{
		socket.ws = new WebSocket("ws://" + location.host + "/PongGameWs/");

		socket.ws.onopen = () => console.log("Connected to Game Server");
		socket.ws.onmessage = (e) => this.handleServerMessage(e);
		socket.ws.onclose = () => {
			this.isFinished = true;
			this.isGameStarted = false;
			console.log("Disconnected from Game Server");
		};

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
	
	applyMove(e)
	{
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
				if (e.key == "ArrowUp")
				  ToServer.move = "UP";
				else 
				  ToServer.move = "DOWN";
				socket.ws.send(JSON.stringify(ToServer));
			}
		}
	}
	
	handleServerMessage(e)
	{
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
  	} else if (this.isGameStarted == true && this.isFinsih == false) {
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
	}
}

// Pong Local View
export class PongLocal extends HTMLElement {
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
// Pong Tournement
export class PongTour extends HTMLElement {
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
		socket.ws = new WebSocket("ws://" + location.host + "/PongTourWs/");
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
			const ws2 = new WebSocket("ws://" + location.host + "/PongTourWs/");
			ws2.onopen = function () {
				console.log("Welcome To The Final Round");
			};
		}
	}
	disconnectedCallback() {
		document.removeEventListener("keyup", this.applyDown);
	}
}
// Setting View
export class Setting extends HTMLElement {
	constructor() {
		super();
		// this.root = this.attachShadow({ mode: "open" });
	}
	connectedCallback() {
		this.setAttribute("id", "setting-view");
		this.setAttribute("hidden", "");
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
	render() {
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
					} else {
						float.setAttribute("style", "display: none");
						profileCard.classList.remove("blur");
					}
					// post data to the backend for changing the user fullname
				}
				// console.log("target: ", e.target)
				// console.log("current target: ", e.currentTarget)
				if (e.target === float) {
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
export class ConfirmMsg extends HTMLElement {
	constructor() {
		super("foor");
		this.root = this.attachShadow({ mode: "open" });
	}
	connectedCallback() {
		this.setAttribute("id", "confirm-msg");
		this.setAttribute("style", "display: none");
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
          <div class="text-right">
            <button class="btn btn-cancel">Cancel</button>
            <button class="btn btn-primary">Ok</button>
          </div>
        </div>
      </div>
    `;
		const game = this.getAttribute("game");
		this.cancel = this.root.querySelector(".btn-cancel");
		this.leave = this.root.querySelector(".btn-primary");

		window.onpopstate = () => {
			history.replaceState(
				{ path: "/game" },
				null,
				location.origin + "/game"
			);
			// console.log(`${game} popState triggered!`);
			this.setAttribute("style", "display: block");
		};
		this.fcancel = () => {
			// console.log("canceling");
			this.setAttribute("style", "display: none");
		};
		this.fleave = () => {
			this.setAttribute("style", "display: none");
			console.log("which game would be removed: ", game);
			aborting(socket.ws, game);
			window.router.goto("/platform");
		};
		this.cancel.addEventListener("click", this.fcancel);
		this.leave.addEventListener("click", this.fleave);

		window.onpopstate = () => {
			history.replaceState(
				{ path: "/game" },
				null,
				location.origin + "/game"
			);
			// console.log(`${game} popState triggered!`);
			this.setAttribute("style", "display: block");
		};
		this.fcancel = () => {
			// console.log("canceling");
			this.setAttribute("style", "display: none");
		};
		this.fleave = () => {
			// console.log("leaving");
			this.setAttribute("style", "display: none");
			console.log("whiche game would be removed: ", game);
			aborting(socket.ws, game);
			window.router.goto("/platform");
		};
		this.cancel.addEventListener("click", this.fcancel);
		this.leave.addEventListener("click", this.fleave);

		window.onbeforeunload = function () {
			aborting(socket.ws, game);
		};
	}
	disconnectedCallback() {
		// console.log("confirm masg removed");
		this.cancel.removeEventListener("click", this.fcancel);
		this.leave.removeEventListener("click", this.fleave);
		window.onpopstate = null;
		window.onbeforeunload = null;
	}
}
// Abort Game Button
export class AbortButton extends HTMLElement {
	constructor() {
		super();
		// this.root = this.attachShadow({ mode: 'open' });
	}
	connectedCallback() {
		this.setAttribute("class", "abort");
		this.confirm = this.innerHTML = `
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
		const confirmMsg = parent.querySelector("confirm-msg");
		this.cancel = confirmMsg.querySelector(".btn-cancel");
		this.leave = confirmMsg.querySelector(".btn-primary");
		this.listener = () => {
			confirmMsg.setAttribute("style", "display: block");
		};
		this.addEventListener("click", this.listener);
	}
}
// Main UI View
export class MainUI extends HTMLElement {
	constructor() {
		super();
	}
	connectedCallback() {
		const home = document.createElement("home-view");
		const left = document.createElement("div");
		const right = document.createElement("div");
		const middle = document.createElement("div");
		const chat = document.createElement("chat-view");
		const game = document.createElement("game-view");
		const sidebar = document.createElement("sidebar-view");
		const profile = document.createElement("profile-view");
		const setting = document.createElement("setting-view");
		const platform = document.createElement("platform-view");

		this.setAttribute("id", "main-ui");
		left.setAttribute("id", "left-view");
		left.setAttribute("hidden", "");
		right.setAttribute("id", "right-view");
		right.setAttribute("hidden", "");
		middle.setAttribute("id", "middle-view");
		middle.setAttribute("hidden", "");

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
