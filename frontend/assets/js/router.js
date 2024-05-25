import Routes from "./routes.js";

const router = {

    handleLinkClick: function (event) {
        console.log("called");
        const { href } = event.target;
        window.history.pushState({}, "", href);
        this.loadContent();
    },

    loadContent: async function () {
        let app = document.querySelector("#app");
        let card_hold = document.querySelector("#card-hold");
        let pathname = window.location.pathname || "/";
        
        let src = Routes.find(route => route.path === pathname ) || Routes.find(route => route.path === "*");

        if (src.name == "login" && card_hold != undefined)
            app = card_hold;

        try {
            const content = await fetch(src.view).then(res => res.text());
            app.innerHTML = content;
        } catch (error) {
            console.log("Error loading content:", error);
        }
    }
}
export default router;