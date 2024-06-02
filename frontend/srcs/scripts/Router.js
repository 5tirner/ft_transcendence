import Auth from "./Auth.js";
import API from "./API.js"
import { renderHome } from "./components/Home.js";
import { login_page } from "./components/Login.js";
import { account_page } from "./components/account.js";
import { chat_page } from "./components/chat.js";
import { game_page } from "./components/game.js";
import { register_page } from "./components/register.js";
import { settings_page } from "./components/settins.js";

const Router = {
    init: async () => {
        // loop trough all links with class navlink and prevent default bahaviour when
        // clicking so it doesn't take us to new page
        document.querySelectorAll("a.navlink").forEach((a) => {
            a.addEventListener("click", (event) => {
                event.preventDefault();
                const href = event.currentTarget.getAttribute("href");
                Router.go(href);
            });
        });
        // It listen for history changes
        window.addEventListener("popstate", (event) => {
            Router.go(event.state.route, false);
        });

        if (await Auth.isAuth())
            Router.go(location.pathname);
        else {
            Router.go("/login");
        }
    },
    go: (route, addToHistory = true) => {
        if (addToHistory) {
            history.pushState({ route }, "", route);
        }
        document
            .querySelectorAll("section.page")
            .forEach((s) => (s.style.display = "none"));
        switch (route) {
            case "/":
                renderHome();
                break;
            case "/login":
                login_page();
                break;
            case "/register":
                register_page();
                break;
            case "/account":
                account_page();
                break;
            case "/game":
                game_page();
                break;
            case "/settings":
                settings_page();
                break;
            default:
                break;
        }
        window.scrollX = 0;
        window.scrollY = 0;
    },
};
window.Router = Router; // make it "public"
export default Router;
