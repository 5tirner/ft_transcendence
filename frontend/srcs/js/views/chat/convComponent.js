import { formatListDate } from "./chatList.js";
import { convHeader } from "./conv_head.js";
import { updateNotif } from "./chatList.js";
import { loadMessages } from "./messages_loader.js";
import API from "../../services/API.js";

class convTimeAndNotifElem extends HTMLElement {
	constructor() {
		super();
		this._data = null; // Private property to hold the data object
		this.date = document.createElement("div");
		this.date.className = "time";
		this.notif = document.createElement("div");
		this.notif.className = "notif mx-1 mt-2 invisible";
		this.className = "d-flex align-items-center flex-column";
		this.appendChild(this.date);
		this.appendChild(this.notif);
	}

	set data(value) {
		console.log(value);
	}

	get data() {
		return this._data;
	}

	updateDOM() {}

	connectedCallback() {}

	disconnectedCallback() {}
}

customElements.define("cp-conv-time-notif", convTimeAndNotifElem);

class convUserElem extends HTMLElement {
	constructor() {
		super();
		this._data = null; // Private property to hold the data object
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

	set data(value) {
		console.log(value);
	}

	get data() {
		return this._data;
	}

	updateDOM() {}

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
			console.log(this._data);
			this.userData.image.src = this._data.user.avatar;
			this.userData.username.textContent = this._data.user.username;
			this.userData.userLastMsg.textContent =
				this._data.last_message.content;

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
		this.addEventListener("click", () => {
			const conv = document.querySelector(".chat-conv-wrapper");
			const messages = conv.querySelector(".messages");
			const convHeadParent = conv.querySelector(".chat-conv");
			const convHead = conv.querySelector(".conve-header");

			conv.style.display = "block";

			convHeadParent.removeChild(convHead);
			convHeadParent.insertBefore(
				convHeader(this._data.user, this._data.id),
				convHeadParent.firstChild
			);
			loadMessages(messages, this._data.id);
			API.markMessagesAsRead(this._data.id);
			updateNotif(this._data.user.username, true);
		});
	}
	disconnectedCallback() {}
}

customElements.define("cp-conv", ConvElement, { extends: "li" });
