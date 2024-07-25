import { router } from "./service/router.js";
import { MainUI, Sidebar, Game, Platform, Profile, Home, TTT, Login } from "./view/mainUI.js";
window.prevState = null;
// window.ws = null;
window.router = router;
window.component = {};

document.addEventListener("DOMContentLoaded", () =>
{
    customElements.define("main-ui", MainUI);
    customElements.define("home-view", Home);
    customElements.define("login-view", Login);
    customElements.define("sidebar-view", Sidebar);
    customElements.define("platform-view", Platform);
    customElements.define("game-view", Game);
    customElements.define("ttt-view", TTT);
    // customElements.define("profile-view", Profile);

    window.component = {
        home: document.querySelector("home-view"),
        left: document.getElementById("left-view"),
        middle: document.getElementById("middle-view"),
        right: document.getElementById("right-view"),
    }
    window.addEventListener("popstate", (e) => {
      if (e.state.path !== '/home' && e.state.path !== '/login')
        router.redirecto(e.state.path);
      else
        router.redirecto('/platform');
      // aborting()
    });
    router.redirecto(location.pathname);
});