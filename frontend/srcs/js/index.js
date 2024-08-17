import { router } from "./service/router.js";
import {
	MainUI,
	Sidebar,
	Game,
	Home,
	TTT,
	Login,
	Pong,
	ConfirmMsg,
	AbortButton,
	PongLocal,
	Platform,
	Stats,
	Histo,
	PongTour,
	ResultMsg,
	PongAnimation,
	TicTacToeAnimation
} from "./view/mainUI.js";

import { ChatComponent } from "./view/chat/chat.js";

window.prevState = null;
window.router = router;
window.component = {};
window.goBack = true;

document.addEventListener("DOMContentLoaded", () => {
	customElements.define("home-view", Home);
	customElements.define("main-ui", MainUI);
	customElements.define("platform-view", Platform);
	customElements.define("login-view", Login);
	customElements.define("sidebar-view", Sidebar);
	customElements.define("game-view", Game);
	customElements.define("ttt-view", TTT);
	customElements.define("pong-view", Pong);
	customElements.define("confirm-msg", ConfirmMsg);
	customElements.define("abort-btn", AbortButton);
	customElements.define("po-local-view", PongLocal);
	customElements.define("stat-ics", Stats);
	customElements.define("history-view", Histo);
	customElements.define("tournament-view", PongTour);
	customElements.define("result-msg", ResultMsg);
	customElements.define("chat-view", ChatComponent);
	customElements.define("pong-animation", PongAnimation);
	customElements.define("tic-tac-toe-anim", TicTacToeAnimation);

	window.component = {
		home: document.querySelector("home-view"),
		left: document.getElementById("left-view"),
		middle: document.getElementById("middle-view"),
		right: document.getElementById("right-view")
	};

	router.redirecto("/platform");
});
