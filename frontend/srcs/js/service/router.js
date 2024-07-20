import { auth } from "../auth/Authentication.js";
export const router = {
	goto: (path, addToHistory = true) =>
	{
	  let  container = document.getElementById(`${path.substring(1)}-view`);
		if ( path !== "/" )
		{
			window.component.left.removeAttribute('hidden');
			window.component.right.removeAttribute('hidden');
			window.component.middle.removeAttribute('hidden');
			container.removeAttribute('hidden');
		}
		else
		{
		  container = document.getElementById(`home-view`);
		  window.component.left.setAttribute('hidden', '');
      window.component.right.setAttribute('hidden', '');
      window.component.middle.setAttribute('hidden', '');
      container.removeAttribute('hidden');
		}

		if ( addToHistory )
			history.pushState({ path }, null, location.origin + path);
		window.scrollTo(0, 0);
	},

	redirecto: async (path) =>
	{
		const userIsLogged = await auth.isAuth();
		if (userIsLogged)
		{ 
			if (path === "/login" || path === "/")
				router.goto("/platform");
			else
				router.goto(path);
		}
		else
		{
			if (  path === "/login" )
				router.goto("/login");
			else
				router.goto("/");
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