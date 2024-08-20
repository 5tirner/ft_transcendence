import { auth } from "../auth/Authentication.js";

export const router = {
	goto: (path, push = true) =>
	{
    router.routes(path, push);
    window.scrollTo(0, 0);
	},

	redirecto: async (path) => {
		const userIsLogged = await auth.isAuth();
		if (userIsLogged)
		{
      let pathname = window.location.pathname;
      if (pathname === '/')
        pathname = '/platform';
      window.component.root.innerHtml = '';
      window.component.root.appendChild(window.component.main);
      router.goto(pathname);
		}
		else
		{
      if (path === "/") path = "/home";
      if (path !== '/home' && path !== '/login') // 404
        return;
      window.component.root.innerHtml = '';
      window.component.root.appendChild(window.component.home);
		}
	},
	
	routes: (currentLocation, push) =>
   {
 		switch (currentLocation)
 		{
			case '/platform':
			case '/profile':
			case '/setting':
			case '/history':
			case '/friend':
			case '/game':
			{
        if (currentLocation === '/game')
          currentLocation = '/platform';
        
        //check if the component already exist -> working now but needs more testing
        const component = window.component.midl.querySelector(`${currentLocation.substring(1)}-view`);
        if (component)
          return;
        if (push)
          history.pushState(null, null, location.origin + currentLocation);
        const elem = document.createElement(`${currentLocation.substring(1)}-view`);
        window.component.midl.innerHTML = "";
        window.component.midl.appendChild(elem);
        return;
			}
			default:
        console.log("NoT Found 404");
    }
   },
   
   game: (_game) =>
	{
    const elem = document.createElement('game-view');
    window.component.midl.innerHTML = "";
    window.component.midl.appendChild(elem);
      
    switch(_game)
    {
      case 'pong':
      case 'ttt':
      case 'po-local':
      case 'tournament':
      {
        const gameSec = elem.querySelector('.game-section');
        const game = document.createElement(`${_game}-game`);
        gameSec.appendChild(game);
        history.replaceState(
				null,
				null,
				location.origin + "/game"
       	);
        return;
      }
    }
	}
};


