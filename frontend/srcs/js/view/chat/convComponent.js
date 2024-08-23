import { formatListDate } from "./chatList.js";
import { updateNotif } from "./chatList.js";
import { loadMessages } from "./messages_loader.js";
import API from "../../service/API.js";

export class ConvHeadElem extends HTMLDivElement {
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
		console.log("vaaaal", value);
		this.setAttribute("data-room-id", value);
	}

	get roomId() {
		return this._roomId;
	}

	clickHandler = () => {
		const conv = document.querySelector(".chat-conv-wrapper");
		conv.style.display = "none";
		document.querySelector(".messages").innerHTML = "";
		document.querySelector(".username-conv").innerHTML = "";
		document.querySelector(".username-conv").user_id = -1;
	};
	gameInviteHandler = () => {
		console.log("user_id", this.data.id, "room_id", this._roomId);
	};

	render() {
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
		controllerIcon.alt = "invite to game";
		controllerIcon.src = "js/view/src/img/GameController.svg";
		controllerIcon.addEventListener("click", this.gameInviteHandler);
		this.appendChild(controllerIcon);
	}
	connectedCallback() {}

	disconnectedCallback() {
		// Clean up any listeners if necessary
		console.log("remove from dom conv head");
	}
}

customElements.define("conv-head", ConvHeadElem, { extends: "div" });

class convTimeAndNotifElem extends HTMLElement {
	constructor() {
		super();
		this.date = document.createElement("div");
		this.date.className = "time";
		this.notif = document.createElement("div");
		this.notif.className = "notif mx-1 mt-2 invisible";
		this.className = "d-flex align-items-center flex-column";
		this.appendChild(this.date);
		this.appendChild(this.notif);
	}

	connectedCallback() {}

	disconnectedCallback() {}
}

customElements.define("cp-conv-time-notif", convTimeAndNotifElem);

class convUserElem extends HTMLElement {
	constructor() {
		super();
		// avatar
		this.userAvatar = document.createElement("div");
		this.userAvatar.className = "profile-container";
		this.image = document.createElement("img");
		this.image.className = "profile-pic";
		this.userAvatar.appendChild(this.image);
		// user info username and lastmsg sent
		this.userInfo = document.createElement("div");
		this.userInfo.className = "mx-2";
		this.username = document.createElement("div");
		this.username.className = "username";
		this.userLastMsg = document.createElement("div");
		this.userLastMsg.className = "message";
		this.userInfo.appendChild(this.username);
		this.userInfo.appendChild(this.userLastMsg);
		this.className = "d-flex align-items-center";
		this.appendChild(this.userAvatar);
		this.appendChild(this.userInfo);
	}

	connectedCallback() {}

	disconnectedCallback() {}
}

customElements.define("cp-conv-user", convUserElem);

export class ConvElement extends HTMLLIElement {
	constructor() {
		super();
		this._data = null;
		this.className =
			"list-group-item d-flex align-items-center justify-content-between px-1";
		this.userData = new convUserElem();
		this.dateAndNotif = new convTimeAndNotifElem();
		this.appendChild(this.userData);
		this.appendChild(this.dateAndNotif);
	}

	set data(value) {
		this._data = value;
		this.updateDOM();
	}

	get data() {
		return this._data;
	}

	updateDOM() {
		if (this._data) {
			this.userData.image.src = this._data.user.avatar;
			this.userData.username.textContent = this._data.user.username;

			const content = this._data.last_message.content;
			if (content && content.length > 8) {
				this.userData.userLastMsg.textContent =
					content.slice(0, 5) + "...";
			} else {
				this.userData.userLastMsg.textContent = content;
			}

			if (this._data.last_message.timestamp == null)
				this.dateAndNotif.date.textContent = "";
			else {
				const date = new Date(this._data.last_message.timestamp);
				this.dateAndNotif.date.textContent = formatListDate(date);
			}

			if (
				this._data.last_message.unreaded != null &&
				this._data.last_message.unreaded != 0
			) {
				this.dateAndNotif.notif.className = "notif mx-1 mt-2 visible";
				if (this._data.last_message.unreaded <= 9)
					this.dateAndNotif.notif.textContent =
						this._data.last_message.unreaded;
				else this.dateAndNotif.notif.textContent = "+9";
			} else {
				this.dateAndNotif.notif.className = "notif mx-1 mt-2 invisible";
			}
			this.dateAndNotif.notif;
		}
	}

	connectedCallback() {
		const clickHandler = () => {
			const conv = document.querySelector(".chat-conv-wrapper");
			const messages = conv.querySelector(".messages");
			const convHeadParent = conv.querySelector(".chat-conv");
			let convHead = conv.querySelector(".conve-header");

			conv.style.display = "block";

			convHeadParent.removeChild(convHead);

			convHead = new ConvHeadElem();
			convHead.data = this._data.user;
			convHead.roomId = this._data.id;
			convHeadParent.insertBefore(convHead, convHeadParent.firstChild);
			loadMessages(messages, this._data.id);
			API.markMessagesAsRead(this._data.id);
			updateNotif(this._data.user.id, true);
		};
		this.addEventListener("click", clickHandler);
		this._clickListener = clickHandler;
	}
	disconnectedCallback() {
		if (this._clickListener) {
			this.removeEventListener("click", this._clickListener);
		}
	}
}

customElements.define("cp-conv", ConvElement, { extends: "li" });

// export function convHeader(userData, roomId) {
// 	// Create the main container element
// 	const conversationHeader = document.createElement("div");
// 	conversationHeader.classList.add("conve-header");
// 	conversationHeader.setAttribute("data-room-id", roomId);
//
// 	// Create the arrow icon
// 	const arrowIcon = document.createElement("img");
// 	arrowIcon.addEventListener("click", (event) => {
// 		const conv = document.querySelector(".chat-conv-wrapper");
// 		conv.style.display = "none";
// 		document.querySelector(".messages").innerHTML = "";
// 		document.querySelector(".username-conv").innerHTML = "";
// 		document.querySelector(".username-conv").user_id = -1;
// 	});
// 	arrowIcon.classList.add("frame-icon");
// 	arrowIcon.alt = "";
// 	arrowIcon.src = "js/view/src/img/arrow.svg";
// 	conversationHeader.appendChild(arrowIcon);
//
// 	// Create the user avatar
// 	const userAvatar = document.createElement("img");
// 	userAvatar.classList.add("user-avatar");
// 	userAvatar.alt = "user";
// 	userAvatar.src = userData.avatar;
// 	conversationHeader.appendChild(userAvatar);
//
// 	// Create the username container
// 	const usernameContainer = document.createElement("div");
// 	usernameContainer.classList.add("username-conv");
// 	usernameContainer.textContent = userData.username; // Assuming username is provided
// 	usernameContainer.user_id = userData.id;
// 	conversationHeader.appendChild(usernameContainer);
//
// 	// Create the controller icon
// 	const controllerIcon = document.createElement("img");
// 	controllerIcon.classList.add("controler-icon");
// 	controllerIcon.alt = "";
// 	controllerIcon.src = "js/view/src/img/GameController.svg";
// 	conversationHeader.appendChild(controllerIcon);
//
// 	return conversationHeader;
// }
