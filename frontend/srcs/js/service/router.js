import { auth } from "../auth/Authentication.js";
export const router = {
  mainui: document.querySelector("main-ui"),
  
  goto: (path, whichGame = "default", addToHistory = true) =>
	{
	  let previousLocation = history.state ? history.state.path : null;
	  if ( addToHistory )
			{
        console.log("path: ", path);
 			  history.pushState({ path }, null, location.origin + path);
			}
		let currentLocation = path;
		console.log("currentLocation: ", currentLocation);
		console.log("previousLocation: ", previousLocation);
	  if ( path === '/home' )
		{
      const home = document.querySelector('home-view');
      if (home)
        home.removeAttribute('hidden');
		}
		else
		{
      if ( window.component.home )
        window.component.home.setAttribute('hidden', '');
      if (previousLocation === '/' || !previousLocation)
        previousLocation = '/home';
		  const previousView = document.querySelector(`${previousLocation.substring(1)}-view`);
		  const currentView = document.querySelector(`${currentLocation.substring(1)}-view`);
				
		  if ( previousView && previousLocation !== currentLocation )
				previousView.setAttribute('hidden', '');
			if ( currentView )
			  currentView.removeAttribute('hidden');

	    window.component.left.removeAttribute('hidden');
			window.component.right.removeAttribute('hidden');
			window.component.middle.removeAttribute('hidden');
			
		}
		window.scrollTo(0, 0);
	},

	redirecto: async (path) =>
	{
    if (path === '/')
  		path = '/home';
		const userIsLogged = await auth.isAuth();
		if (userIsLogged)
		{ 
			if (path === "/login" || path === "/home")
				router.goto("/platform");
			else
				router.goto(path);
		}
		else
		{
			if (  path === "/login" )
				router.goto("/login");
			else
				router.goto("/home");
		}
	}
}

/*
case 1:
	first time enter to the app; -> 
case 2:
	enter specific url;
case 3:
	refresh the page in specific url
*/

// if ( path == "/game" && whichGame === 'ttt' )
// 		{
// 		  const currentView = document.querySelector(`${location.path.substring(1)}-view`);;
// 		  let  container = document.getElementById(`${path.substring(1)}-view`);
//     window.component.left.removeAttribute('hidden');
// 		window.component.right.removeAttribute('hidden');
// 		window.component.middle.removeAttribute('hidden');
// 		if ( currentView !== container  )
// 		 currentView.setAttribute('hidden', '');
// 		container.removeAttribute('hidden');
// 		}
//   const currentView = document.querySelector(`${location.path.substring(1)}-view`);;
	 //  let  container = document.getElementById(`${path.substring(1)}-view`);
		// if ( path !== "/" )
		// {
		// 	window.component.left.removeAttribute('hidden');
		// 	window.component.right.removeAttribute('hidden');
		// 	window.component.middle.removeAttribute('hidden');
		// 	if ( currentView !== container  )
		// 	 currentView.setAttribute('hidden', '');
		// 	container.removeAttribute('hidden');
		// }
		// else
		// {
		//   container = document.getElementById(`home-view`);
		//   window.component.left.setAttribute('hidden', '');
//     window.component.right.setAttribute('hidden', '');
//     window.component.middle.setAttribute('hidden', '');
//     container.removeAttribute('hidden');
		// }