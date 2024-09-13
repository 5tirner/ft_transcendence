import { formatListDate } from "./chatList.js";
import { updateNotif } from "./chatList.js";
import { loadMessages } from "./messages_loader.js";
import API from "../../service/API.js";
import { friendUpdate } from "../friendsUpdate.js";
export const GAME_INV = "game_inv";
export const ACC_GAME = "acc_game";

export class UserProfile extends HTMLElement {
	constructor() {
		super();
		this._data = null;
	}

	set data(value) {
		this._data = value;
		this.updateDOM();
	}

	get data() {
		return {
			username: this.username,
			avatar: this.avatar,
			email: this.email,
			firstName: this.firstName,
			lastName: this.lastName
		};
	}

	backHandler = () => {
		this.remove();
	};

	connectedCallback() {
		this.className = "user-profile";
		this.innerHTML = `
            <div class="user-info-header">
                <img class="frame-icon" src="js/view/src/img/arrow.svg" alt="Back">
                <div class="user-info">User Info</div>
            </div>
            <div class="image-container">
                <img src="" alt="User Image">
            </div>
            <div class="user-details">
                <p class="username"></p>
                <p class="full-name"></p>
                <p class="email"></p>
            </div>
        `;

		this.querySelector(".frame-icon").addEventListener(
			"click",
			this.backHandler
		);
	}

	async updateDOM() {
		const req = await API.getUserProfile(this._data);
		if (req.status == 200) {
			const data = await req.json();
			const player = data.player.pop();

			this.querySelector(".image-container img").src = player.avatar;
			this.querySelector(".user-details .username").textContent =
				player.username;
			this.querySelector(".user-details .full-name").textContent =
				`Name: ${player.first_name} ${player.last_name}`;
			this.querySelector(".user-details .email").textContent =
				`Email: ${player.email}`;

			// Store the data for the getter
			this.username = player.username;
			this.avatar = player.avatar;
			this.email = player.email;
			this.firstName = player.first_name;
			this.lastName = player.last_name;
		}
	}

	disconnectedCallback() {
		this.querySelector(".frame-icon").removeEventListener(
			"click",
			this.backHandler
		);
	}
}

customElements.define("user-profile", UserProfile);

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
		friendUpdate(
			{
				username: window.Auth.user,
				id: this._data.id,
				avatar: window.Auth.avatar
			},
			GAME_INV
		);
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
		this.userAvatar = document.createElement("img");
		this.userAvatar.classList.add("user-avatar");
		this.userAvatar.alt = "user";
		this.userAvatar.src = this._data.avatar;
		this.appendChild(this.userAvatar);

		// Create the username container
		const usernameContainer = document.createElement("div");
		usernameContainer.classList.add("username-conv");
		if (this._data.username.length > 8) {
			usernameContainer.textContent =
				this._data.username.slice(0, 5) + "...";
		} else {
			usernameContainer.textContent = this._data.username;
		}
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

	disconnectedCallback() {}
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
			if (this._data.user.username.length > 8) {
				this.userData.username.textContent =
					this._data.user.username.slice(0, 5) + "...";
			} else {
				this.userData.username.textContent = this._data.user.username;
			}

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
		const profileClickHandler = async (event) => {
			console.log(event.target.className);
			if (
				event.target.className == "controler-icon" ||
				event.target.className === "frame-icon"
			)
				return;
			const profile = new UserProfile();
			profile.data = this._data.user;
			const chat = document.querySelector("#right-view");
			chat.appendChild(profile);
		};
		const clickHandler = () => {
			const conv = document.querySelector(".chat-conv-wrapper");
			const messages = conv.querySelector(".messages");
			const convHeadParent = conv.querySelector(".chat-conv");
			let convHead = conv.querySelector(".conve-header");

			conv.style.display = "block";

			convHeadParent.removeChild(convHead);

			convHead = new ConvHeadElem();
			convHead.addEventListener("click", profileClickHandler);
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
