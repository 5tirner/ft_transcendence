export const routes = (previousLocation = '', currentLocation) =>
{
   console.log("current location: ", currentLocation);
	switch (currentLocation)
	{
		case '/platform':
		case '/profile':
		case '/setting':
		case '/history':
		case '/game':
		case '/friend':
		{
		   // check if the component already exist // not working do somthing else
         // const component = window.component.midl.querySelector(`${currentLocation.substring(1)}-view`);
         // if (component)
         //    return;
         
         const elem = document.createElement(`${currentLocation.substring(1)}-view`);
         window.component.midl.innerHTML = "";
         window.component.midl.appendChild(elem);
         return;
		}
		default:
		{
         console.log("NoT Found 404");
		}
	}
};