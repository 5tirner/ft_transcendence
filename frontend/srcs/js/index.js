const component = './view/component/';
const aux = './view/component/auxiliar';
import { router } from "./service/router.js";
import MainUI from "./view/mainUI.js";
import Sidebar from './view/component/Sidebar.js';
import Game from './view/component/Game.js';
import Home from './view/component/Home.js';
import TicTacToe from './view/component/TicTacToe.js';
import Login from './view/component/Login.js';
import Pong from './view/component/Pong.js';
import PongLocal from './view/component/PongLocal.js';
import Platform from './view/component/Platform.js';
import Statistic from './view/component/Statistic.js';
import PongTour from './view/component/PongTour.js';
import ResultMsg from './view/component/auxiliar/ResultMsg.js';
import PongAnim from './view/component/auxiliar/PongAnim.js';
import TicAnim from './view/component/auxiliar/TicAnim.js';
import ConfirmMsg from './view/component/auxiliar/ConfirmMsg.js';
import AbortButton from './view/component/auxiliar/AbortButton.js';
import History from './view/component/History.js';

import { ChatComponent } from "./view/chat/chat.js";

window.prevState = null;
window.router = router;
window.component = {};
window.goBack = true;

document.addEventListener("DOMContentLoaded", () =>
{
	customElements.define("home-view", Home);
	customElements.define("main-ui", MainUI);
	customElements.define("platform-view", Platform);
	customElements.define("login-view", Login);
	customElements.define("sidebar-view", Sidebar);
	customElements.define("game-view", Game);
	customElements.define("ttt-view", TicTacToe);
	customElements.define("pong-view", Pong);
	customElements.define("confirm-msg", ConfirmMsg);
	customElements.define("abort-btn", AbortButton);
	customElements.define("po-local-view", PongLocal);
	customElements.define("stat-ics", Statistic);
	customElements.define("history-view", History);
	customElements.define("tournament-view", PongTour);
	customElements.define("result-msg", ResultMsg);
	customElements.define("chat-view", ChatComponent);
	customElements.define("pong-animation", PongAnim);
	customElements.define("tic-tac-toe-anim", TicAnim);

	window.component = {
		home: document.querySelector("home-view"),
		left: document.getElementById("left-view"),
		middle: document.getElementById("middle-view"),
		right: document.getElementById("right-view")
	};

	router.redirecto("/platform");
});
