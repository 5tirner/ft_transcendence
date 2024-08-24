import { ACC_GAME } from "../chat/convComponent.js";
import { friendUpdate } from "../friendsUpdate.js";

export default class GameInvite extends HTMLElement {
	constructor() {
		super();
		this._data = null;
		this.avatar = document.createElement("img");
		this.usernameSpan = document.createElement("span");
	}

	set data(data) {
		this._data = data;
		this.updateDOM();
	}

	get data() {
		return this._data;
	}
	updateDOM() {
		this.avatar.src = this.data.avatar;
		this.usernameSpan.textContent = this.data.username + "!!";
	}

	customButtom = (btn_id, btn_name) => {
		const button = document.createElement("div");
		button.className = "invite-button";
		button.id = btn_id;
		button.textContent = btn_name;
		return button;
	};

	acceptListener = () => {
		friendUpdate(
			{
				usernmae: this.data.username,
				id: this.data.sender_id,
				avatar: this.data.avatar
			},
			ACC_GAME
		);
		document.getElementById("invite-drop").innerHTML = "";
	};
	rejectListener = () => {
		document.getElementById("invite-drop").innerHTML = "";
	};
	createHeader = () => {
		const headerElem = document.createElement("div");
		const text = document.createElement("div");
		headerElem.className = "d-flex justify-content-around p-2 gap-2";
		this.avatar.className = "profile-pic invite-profile-pic";
		this.usernameSpan.className = "invite-username";
		text.appendChild(this.usernameSpan);
		text.appendChild(document.createTextNode(" has invited you to a game"));
		headerElem.appendChild(this.avatar);
		headerElem.appendChild(text);
		return headerElem;
	};
	connectedCallback() {
		this.id = "game-invite-card";
		this.header = this.createHeader();
		this.accept = this.customButtom("accept-button", "accept");
		this.reject = this.customButtom("reject-button", "reject");
		this.accept.addEventListener("click", this.acceptListener);
		this.reject.addEventListener("click", this.rejectListener);
		const buttonContainer = document.createElement("div");
		buttonContainer.className = "d-flex justify-content-around mx-auto";
		buttonContainer.appendChild(this.accept);
		buttonContainer.appendChild(this.reject);

		this.appendChild(this.header);
		this.appendChild(buttonContainer);
	}
	disconnectedCallback() {
		if (this._acceptListener) {
			this.removeEventListener("click", this._acceptListener);
		}
		if (this._rejectListener) {
			this.removeEventListener("click", this._rejectListener);
		}
	}
}

customElements.define("invite-elem", GameInvite);
