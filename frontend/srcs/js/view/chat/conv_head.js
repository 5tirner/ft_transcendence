export function convHeader(userData, roomId) {
	// Create the main container element
	const conversationHeader = document.createElement("div");
	conversationHeader.classList.add("conve-header");
	conversationHeader.setAttribute("data-room-id", roomId);

	// Create the arrow icon
	const arrowIcon = document.createElement("img");
	arrowIcon.addEventListener("click", (event) => {
		const conv = document.querySelector(".chat-conv-wrapper");
		conv.style.display = "none";
		document.querySelector(".messages").innerHTML = "";
		document.querySelector(".username-conv").innerHTML = "";
		document.querySelector(".username-conv").user_id = -1;
	});
	arrowIcon.classList.add("frame-icon");
	arrowIcon.alt = "";
	arrowIcon.src = "js/view/src/img/arrow.svg";
	conversationHeader.appendChild(arrowIcon);

	// Create the user avatar
	const userAvatar = document.createElement("img");
	userAvatar.classList.add("user-avatar");
	userAvatar.alt = "user";
	userAvatar.src = userData.avatar;
	conversationHeader.appendChild(userAvatar);

	// Create the username container
	const usernameContainer = document.createElement("div");
	usernameContainer.classList.add("username-conv");
	usernameContainer.textContent = userData.username; // Assuming username is provided
	usernameContainer.user_id = userData.id;
	conversationHeader.appendChild(usernameContainer);

	// Create the controller icon
	const controllerIcon = document.createElement("img");
	controllerIcon.classList.add("controler-icon");
	controllerIcon.alt = "";
	controllerIcon.src = "js/view/src/img/GameController.svg";
	conversationHeader.appendChild(controllerIcon);

	return conversationHeader;
}

class ConvHead extends HTMLDivElement {
	constructor() {
		super();
		this._data = null;
		this._roomId = null;
	}

	set data(value) {
		this._data = value;
		this.render();
	}

	get data() {
		return this._data;
	}

	set roomId(value) {
		this._roomId = value;
		this.setAttribute("data-room-id", value);
	}

	get roomId() {
		return this._roomId;
	}

	clickHandler() {
		const conv = document.querySelector(".chat-conv-wrapper");
		conv.style.display = "none";
		document.querySelector(".messages").innerHTML = "";
		document.querySelector(".username-conv").innerHTML = "";
		document.querySelector(".username-conv").user_id = -1;
	}

	connectedCallback() {
		if (!this._data) return;

		this.classList.add("conve-header");

		// Clear any existing content
		this.innerHTML = "";

		// Create the arrow icon
		const arrowIcon = document.createElement("img");
		arrowIcon.classList.add("frame-icon");
		arrowIcon.alt = "";
		arrowIcon.src = "js/view/src/img/arrow.svg";
		arrowIcon.addEventListener("click", this.clickHandler);
		this.appendChild(arrowIcon);

		// Create the user avatar
		const userAvatar = document.createElement("img");
		userAvatar.classList.add("user-avatar");
		userAvatar.alt = "user";
		userAvatar.src = this._data.avatar;
		this.appendChild(userAvatar);

		// Create the username container
		const usernameContainer = document.createElement("div");
		usernameContainer.classList.add("username-conv");
		usernameContainer.textContent = this._data.username;
		usernameContainer.user_id = this._data.id;
		this.appendChild(usernameContainer);

		// Create the controller icon
		const controllerIcon = document.createElement("img");
		controllerIcon.classList.add("controler-icon");
		controllerIcon.alt = "";
		controllerIcon.src = "js/view/src/img/GameController.svg";
		this.appendChild(controllerIcon);
	}

	disconnectedCallback() {
		// Clean up any listeners if necessary
	}
}

customElements.define("conv-head", ConvHead, { extends: "div" });
