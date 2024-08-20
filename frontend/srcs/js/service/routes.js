export const routes = (previousLocation, currentLocation) => {
	let previousView = null;
	switch (currentLocation)
	{
		case "/platform":
		case "/profile":
		case "/setting":
		case "/history":
		case "/game":
		case "/friend":
		{
			const currentView = document.querySelector(`${currentLocation.substring(1)}-view`);
            if (previousLocation)
            {
               previousView = document.querySelector(`${previousLocation.path.substring(1)}-view`);
            }
         
			if (previousView) previousView.setAttribute("hidden", "");
			if (currentView) currentView.removeAttribute("hidden");
			window.component.middle.removeAttribute("style");
		}
		default:
		{
         console.log("NoT Found 404");
		}
	}
};
