import { router } from "./service/router.js";
import { MainUI, Sidebar, Game, Platform, Profile, Home, TTT, Login, Pong, ConfirmMsg, AbortButton, PongLocal } from "./view/mainUI.js";

window.prevState  = null;
window.router     = router;
window.component  = {};
window.goBack    = true;

document.addEventListener("DOMContentLoaded", () =>
{
    customElements.define("main-ui", MainUI);
    customElements.define("home-view", Home);
    customElements.define("login-view", Login);
    customElements.define("sidebar-view", Sidebar);
    customElements.define("platform-view", Platform);
    customElements.define("game-view", Game);
    customElements.define("ttt-view", TTT);
    customElements.define("pong-view", Pong);
    customElements.define("confirm-msg", ConfirmMsg);
    customElements.define("abort-btn", AbortButton);
    customElements.define("po-local-view", PongLocal);

    window.component = {
        home: document.querySelector("home-view"),
        left: document.getElementById("left-view"),
        middle: document.getElementById("middle-view"),
        right: document.getElementById("right-view"),
    }
    
    router.redirecto('/platform');
    
    // window.addEventListener("popstate", (e) => {
    //   if (e.state.path !== '/home' && e.state.path !== '/login')
    //   { 
    //     console.log("1");
    //     router.redirecto(e.state.path);
    //   }
    //   else
    //     router.redirecto('/platform');
    // });
});