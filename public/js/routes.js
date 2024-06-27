const viewCallback = ( page ) => {
    if ( !page.length )
        page = "home";
    return ( document.createElement(`${page}-page`) );
}

const notFound = () => {
    const container = document.createElement("div");
    container.textContent = "404 Not Found";
    return container;
}

const viewPlatform = () => {
    return ( document.createElement("platform-page") );
}

export const routes = [
    { path: '/', view: viewCallback },
    { path: '/login', view: viewCallback },
    { path: '/platform', view: viewCallback },
    { path: '/profile', view: viewPlatform },
    { path: '/game', view: viewPlatform },
    { path: '*', view: notFound }
]