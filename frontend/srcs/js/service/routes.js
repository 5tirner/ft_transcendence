export const routes = (path) => {
    const container = document.createElement("div");
    switch( path )
    {
        case "/":
        case "/login":
        case "/platform":
        case "/profile":
        case "/setting":
        case "/game":
        {
            let page = path.substring(1);
            if (!page.length) page = "home";
            return ( document.createElement(`${page}-view`) );
        }
        default:
        {
            container.textContent = "404 Not Found";
            return container;
        }
    }
};