// class ConversationHeader extends HTMLElement {
// 	constructor() {
// 		super();
//
// 		const shadowRoot = this.attachShadow({ mode: "open" });
//
// 		// Create header elements
// 		const headerContainer = document.createElement("div");
// 		headerContainer.classList.add("conve-header");
//
// 		const arrowIcon = document.createElement("img");
// 		arrowIcon.classList.add("frame-icon");
// 		arrowIcon.alt = "";
// 		arrowIcon.src = "./svg_dir/arrow.svg";
// 		arrowIcon.addEventListener("click", () => {
// 			const conv = this.getRootNode().querySelector(".chat-conv-wrapper");
// 			conv.style.display = "none";
// 			this.getRootNode().querySelector(".messages").innerHTML = "";
// 		});
//
// 		const userAvatar = document.createElement("img");
// 		userAvatar.classList.add("user-avatar");
// 		userAvatar.alt = "user";
// 		userAvatar.src = this.getAttribute("user-avatar"); // Use attribute for avatar
//
// 		const usernameContainer = document.createElement("div");
// 		usernameContainer.classList.add("username-conv");
// 		usernameContainer.textContent = this.getAttribute("user-name"); // Use attribute for username
//
// 		const controllerIcon = document.createElement("img");
// 		controllerIcon.classList.add("controler-icon");
// 		controllerIcon.alt = "";
// 		controllerIcon.src = "./svg_dir/GameController.svg";
//
// 		headerContainer.append(
// 			arrowIcon,
// 			userAvatar,
// 			usernameContainer,
// 			controllerIcon
// 		);
//
// 		shadowRoot.appendChild(headerContainer);
// 	}
//
// 	// Access and potentially update user data through attributes
// 	static get observedAttributes() {
// 		return ["user-avatar", "user-name"];
// 	}
//
// 	attributeChangedCallback(name, oldValue, newValue) {
// 		if (name === "user-avatar") {
// 			this.shadowRoot.querySelector(".user-avatar").src = newValue;
// 		} else if (name === "user-name") {
// 			this.shadowRoot.querySelector(".username-conv").textContent =
// 				newValue;
// 		}
// 	}
// }
//
// customElements.define("conversation-header", ConversationHeader);

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
	});
	arrowIcon.classList.add("frame-icon");
	arrowIcon.alt = "";
	arrowIcon.src = "./svg_dir/arrow.svg";
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
	conversationHeader.appendChild(usernameContainer);

	// Create the controller icon
	const controllerIcon = document.createElement("img");
	controllerIcon.classList.add("controler-icon");
	controllerIcon.alt = "";
	controllerIcon.src = "./svg_dir/GameController.svg";
	conversationHeader.appendChild(controllerIcon);

	return conversationHeader;
	// const conversationHeader = document.createElement("conversation-header");
	// conversationHeader.setAttribute("user-avatar", userData.avatar);
	// conversationHeader.setAttribute("user-name", userData.username);
	// conversationHeader.setAttribute("data-room-id", roomId);
	// return conversationHeader;
}
