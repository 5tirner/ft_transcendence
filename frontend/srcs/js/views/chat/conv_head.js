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
}
// TODO: add  status bar
// Create the status container
// const statusContainer = document.createElement("div");
// statusContainer.classList.add("status");
// statusContainer.textContent = "online";
// conversationHeader.appendChild(statusContainer);
// TODO: add status dot
// Create the status dot
// const statusDot = document.createElement("div");
// statusDot.classList.add("status-dot", true ? "online" : "offline"); // Set class based on online status
// conversationHeader.appendChild(statusDot);
