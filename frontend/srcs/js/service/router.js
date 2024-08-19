import { auth } from "../auth/Authentication.js";
import { routes } from "./routes.js";
export const router = {
	goto: (path, addToHistory = true) => {
		const previousLocation = window.prevState;
		const currentLocation = path;

		if (currentLocation === "/home") {
			if (window.component.home) {
				window.component.home.removeAttribute("hidden");
				window.component.left.setAttribute("hidden", "");
				window.component.right.setAttribute("hidden", "");
				window.component.middle.setAttribute("hidden", "");
			}
		} else {
			if (currentLocation !== "/game") {
				window.component.right.removeAttribute("hidden");
				window.component.left.removeAttribute("hidden");
			} else {
				window.component.right.setAttribute("hidden", "");
				window.component.left.setAttribute("hidden", "");
			}
			window.component.middle.removeAttribute("hidden");

			if (addToHistory) {
				prevState = { path: currentLocation };
				history.pushState({ path }, null, location.origin + path);
			}

			// middle section logic
			routes(previousLocation, currentLocation);
		}
		window.scrollTo(0, 0);
	},

	redirecto: async (path) => {
		if (path === "/") path = "/home";
		const userIsLogged = await auth.isAuth();
		if (userIsLogged) {
			if (path === "/login" || path === "/home") router.goto("/platform");
			else router.goto(path);
		} else {
			if (path === "/login") router.goto("/login");
			else router.goto("/home");
		}
	}
};

/*
case 1:
	first time enter to the app; -> 
case 2:
	enter specific url;
case 3:
	refresh the page in specific url
*/

