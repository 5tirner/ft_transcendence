import { router } from "./service/router.js";
import { MainUI, Sidebar, Game, Platform, Profile, Home } from "./view/mainUI.js";

window.router = router;
window.component = {};

document.addEventListener("DOMContentLoaded", () =>
{
    customElements.define("main-ui", MainUI);
    customElements.define("sidebar-view", Sidebar);
    customElements.define("home-view", Home);
    customElements.define("game-view", Game);
    customElements.define("platform-view", Platform);
    customElements.define("profile-view", Profile);

    window.component = {
        left: document.getElementById("left-view"),
        middle: document.getElementById("middle-view"),
        right: document.getElementById("right-view"),
    }
    // window.addEventListener("popstate", (e) => {
    //     router.redirecto( e.state.path);
    // });
    router.redirecto(location.pathname);
});