// Main UI View
export default class MainUI extends HTMLElement
{
	constructor() { super(); }
	
	connectedCallback() 
	{
	 this.setAttribute("id", "main-ui");
	
		const home = document.createElement("home-view");
		const left = document.createElement("div");
		const right = document.createElement("div");
		const middle = document.createElement("div");
		const chat = document.createElement("chat-view");
		const game = document.createElement("game-view");
		const sidebar = document.createElement("sidebar-view");
		const profile = document.createElement("profile-view");
		const setting = document.createElement("setting-view");
		const platform = document.createElement("platform-view");
		const friend = document.createElement("friend-view");

		
		left.setAttribute("id", "left-view");
		left.setAttribute("hidden", "");
		right.setAttribute("id", "right-view");
		right.setAttribute("hidden", "");
		middle.setAttribute("id", "middle-view");
		middle.setAttribute("hidden", "");

		right.appendChild(chat);
		left.appendChild(sidebar);

		middle.appendChild(game);
		middle.appendChild(profile);
		middle.appendChild(setting);
		middle.appendChild(platform);
		middle.append(friend);

		this.appendChild(home);
		this.appendChild(left);
		this.appendChild(middle);
		this.appendChild(right);
	}
}
