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

	connectedCallback() {
		// console.log("Custom element added to the page.");
	}

	disconnectedCallback() {
		console.log("Custom element removed from the page.");
	}
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

	connectedCallback() {
		// console.log("Custom element added to the page.");
	}

	disconnectedCallback() {
		console.log("Custom element removed from the page.");
	}
}

customElements.define("cp-conv-user", convUserElem);

export class ConvElement extends HTMLElement {
	constructor() {
		super();
		this._data = null; // Private property to hold the data object
		this.wrapper = document.createElement("li");
		this.wrapper.className =
			"list-group-item d-flex align-items-center justify-content-between px-1";
		this.userData = new convUserElem();
		this.dateAndNotif = new convTimeAndNotifElem();
		this.wrapper.appendChild(this.userData);
		this.wrapper.appendChild(this.dateAndNotif);
		this.appendChild(this.wrapper);
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

			// this.userData.userAvatar.image.src = this._data.user.avatar;

			// this.title.textContent = this._data.title || "Default Title";
			// this.content.textContent = this._data.content || "Default Content";
		}
	}

	connectedCallback() {
		// console.log("Custom element added to the page.");
		// add event listner to handle click
	}

	disconnectedCallback() {
		console.log("Custom element removed from the page.");
	}
}

customElements.define("cp-conv", ConvElement);
