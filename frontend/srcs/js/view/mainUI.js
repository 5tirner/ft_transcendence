export default class MainView extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		this.setAttribute("id", "main-view");

		// side bar container aka left view
		const sidebar = document.createElement("sidebar-view");
		const left = document.createElement("div");
		left.setAttribute("id", "left-view");
		left.appendChild(sidebar);

		// chat container aka right view
		const right = document.createElement("div");
		const chat = document.createElement("chat-view");
		right.setAttribute("id", "right-view");
		right.appendChild(chat);

		// Append child to the parent which is the middle view
		this.appendChild(left);
		this.appendChild(window.component.midl);
		this.appendChild(right);
	}
}
customElements.define("main-view", MainView);

