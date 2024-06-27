export class Router
{
    constructor()
    {
        this.routes = [];
    }

    addRoutes(arrayOfRoutes)
    {
        if (!Array.isArray(arrayOfRoutes)) throw new TypeError("Routes must be provided as an array");
        arrayOfRoutes.forEach((route) => {
            if (!route.path || !route.view) throw new Error("Invalid route object");
            if (typeof route.path !== "string") throw new TypeError("Path must be a string");
            if (typeof route.view !== "function") throw new TypeError("view must be a function");

            this.routes.push(route);
    });
    }
    
    navigateTo(path, containerId ,addToHistory = true)
    {
        const section = document.getElementById(containerId);
        if (addToHistory) history.pushState({ path }, null, path);
        const route = this.routes.find((route) => route.path === location.pathname) ||  this.routes.find((route) => route.path === "*");
        if ( path !== "/login" )
            section.innerHTML = "";
		section.appendChild( route.view( path.substring(1) ) );
        window.scrollX = 0;
        window.scrollY = 0;
    }

    init()
    {
        window.addEventListener("popstate", (e) => {
            this.navigateTo(e.state.path, "root",false);
        });
        this.navigateTo(location.pathname, "root");
    }
}
