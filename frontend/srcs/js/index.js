import { router } from "./service/router.js";
import * as compoents from "./view/component/assets/import.js"

import FriendView from "./view/friendUI.js";
import MainView from "./view/mainUI.js";

window.router = router;
window.component = {};

document.addEventListener("DOMContentLoaded", () => {
	window.component = {
		root: document.getElementById("root"),
		home: document.createElement("home-view"),
		main: document.createElement("main-view"),
		midl: Object.assign(document.createElement("div"), {
			id: "middle-view"
		})
	};
	router.redirecto(window.location.pathname);

	onpopstate = () => {
		router.goto(window.location.pathname, false);
	};
});
