import API from "../service/API.js";

export class FriendElement extends HTMLLIElement {
	constructor() {
		super();
		this._data = null;
		this.className = "user-item";
		this.avatar = document.createElement("img");
		this.avatar.className = "avatar";
		this.avatar.alt = "User avatar";
		this.appendChild(this.avatar);
		this.username = document.createElement("span");
		this.username.className = "username";
		this.appendChild(this.username);

		// Create and append the action buttons container
		this.actionButtonsDiv = document.createElement("div");
		this.actionButtonsDiv.className = "action-buttons";

		// Create and append the add friend button
		this.firstButton = document.createElement("button");
		this.firstButton.type = "button";
		this.firstButton.className = "icon-button add-friend";
		this.firstButton.title = "Add friend";
		this.firstButtonIcon = document.createElement("i");
		this.firstButtonIcon.className = "bi bi-person-plus-fill";
		this.firstButton.appendChild(this.firstButtonIcon);
		this.actionButtonsDiv.appendChild(this.firstButton);

		// Create and append the block user button
		this.secondButton = document.createElement("button");
		this.secondButton.type = "button";
		this.secondButton.className = "icon-button block-user";
		this.secondButton.title = "Block user";
		this.secondButtonIcon = document.createElement("i");
		this.secondButtonIcon.className = "bi bi-person-x";
		this.secondButton.appendChild(this.secondButtonIcon);
		this.actionButtonsDiv.appendChild(this.secondButton);
		this.appendChild(this.actionButtonsDiv);
	}

	set data(value) {
		this._data = value;
		this.updateDOM();
	}

	get data() {
		return this._data;
	}

	updateDOM() {
		if (!this._data) return;

		const addAndAcceptEventHandler = async () => {
			const res = await API.sendAndAcceptFriendRequest(
				this._data.data.id
			);
			const reJson = await res.json();
			const allUsers = document.getElementById("all-users");
			if (allUsers) allUsers.updateDOM();
			const friendList = document.getElementById("friends-list");
			if (friendList) friendList.updateDOM();
			const recv = document.getElementById("received-requests");
			if (recv) recv.updateDOM();
		};
		const blockEventHandler = async () => {
			const res = await API.blockUser(this._data.data.id);
			const allUsers = document.getElementById("all-users");
			if (allUsers) allUsers.updateDOM();
			const friendList = document.getElementById("friends-list");
			if (friendList) friendList.updateDOM();
			const recv = document.getElementById("received-requests");
			if (recv) recv.updateDOM();
			const blockes = document.getElementById("blocked-users");
			if (blockes) blockes.updateDOM();
		};
		const unfriendEventHandler = async () => {
			const res = await API.removeFriend(this._data.data.id);
			const allUsers = document.getElementById("all-users");
			if (allUsers) allUsers.updateDOM();
			const friendList = document.getElementById("friends-list");
			if (friendList) friendList.updateDOM();
		};
		const unblockEventHandler = async () => {
			const res = await API.removeBlock(this._data.data.id);
			const allUsers = document.getElementById("all-users");
			if (allUsers) allUsers.updateDOM();
			const blockes = document.getElementById("blocked-users");
			if (blockes) blockes.updateDOM();
		};
		const addFriendFromBlock = async () => {
			const res = await API.removeBlock(this._data.data.id);
			const res1 = await API.sendAndAcceptFriendRequest(
				this._data.data.id
			);
			const allUsers = document.getElementById("all-users");
			if (allUsers) allUsers.updateDOM();
			const blockes = document.getElementById("blocked-users");
			if (blockes) blockes.updateDOM();
		};
		this.avatar.src = this._data.data.avatar;
		this.username.textContent = this._data.data.username;
		if (this._data.type === "all") {
			this.firstButton.addEventListener(
				"click",
				addAndAcceptEventHandler
			);
			this._clickListener1 = addAndAcceptEventHandler;
			this.secondButton.addEventListener("click", blockEventHandler);
			this._clickListener2 = blockEventHandler;
		} else if (this._data.type === "friends") {
			this.firstButton.className = "icon-button remove-friend";
			this.firstButtonIcon.className = "bi bi-person-dash-fill";
			this.firstButton.title = "remove friend";
			//event handlers
			this.firstButton.addEventListener("click", unfriendEventHandler);
			this._clickListener1 = addAndAcceptEventHandler;
			this.secondButton.addEventListener("click", blockEventHandler);
			this._clickListener2 = blockEventHandler;
		} else if (this._data.type === "requests") {
			this.firstButton.className = "icon-button accept-friend";
			this.firstButtonIcon.className = "bi bi-person-check-fill";
			this.firstButton.title = "Accept request";
			// event handlers
			this.firstButton.addEventListener(
				"click",
				addAndAcceptEventHandler
			);
			this._clickListener1 = addAndAcceptEventHandler;
			this.secondButton.addEventListener("click", blockEventHandler);
			this._clickListener2 = blockEventHandler;
		} else if (this._data.type === "blocked") {
			this.secondButton.className = "icon-button unblock-user";
			this.secondButtonIcon.className = "bi bi-person-dash";
			this.secondButton.title = "Unblock user";
			//event handlers
			this.firstButton.addEventListener("click", addFriendFromBlock);
			this._clickListener2 = addFriendFromBlock;
			this.secondButton.addEventListener("click", unblockEventHandler);
			this._clickListener2 = unblockEventHandler;
		}
	}

	connectedCallback() {
		const clickHandler = () => {};
		this.addEventListener("click", clickHandler);
		this._clickListener = clickHandler;
	}
	disconnectedCallback() {
		if (this._clickListener)
			this.removeEventListener("click", this._clickListener);
		if (this._clickListener1)
			this.removeEventListener("click", this._clickListener1);
		if (this._clickListener2)
			this.removeEventListener("click", this._clickListener2);
	}
}

customElements.define("friend-li", FriendElement, { extends: "li" });

export class FriendCardComponent extends HTMLDivElement {
	constructor() {
		super();
		this._data = null;
		this.className = "friend-card";
		this.header = document.createElement("p");
		this.appendChild(this.header);
		this.UsersList = document.createElement("ul");
		this.appendChild(this.UsersList);
	}

	set data(value) {
		this._data = value;
		this.updateDOM();
	}

	get data() {
		return this._data;
	}

	async getAllUsers() {
		const res = await API.getPlayers();
		if (res.ok) {
			return await res.json();
		}
		return [];
	}

	async getFriends() {
		const res = await API.getFriends();
		if (res.ok) {
			const resJson = await res.json();
			return resJson.friendships;
		}
	}

	async getRequests() {
		const res = await API.getFriendRequest();
		if (res.ok) {
			const resJson = await res.json();
			return resJson.friendships;
		}
	}

	async getBlockedUsers() {
		const res = await API.getBlockedUsers();
		if (res.ok) {
			const resJson = await res.json();
			return resJson.friendships;
		}
	}

	async updateDOM() {
		if (!this._data) return;

		this.UsersList.innerHTML = "";
		if (this._data.type === "all") {
			this.id = "all-users";
			this.header.textContent = "All Users";
			this._data.data = await this.getAllUsers();
			this.UsersList.id = "users";
		} else if (this.data.type === "friends") {
			this.id = "friends-list";
			this.header.textContent = "Friends List";
			this.UsersList.id = "friends";
			this._data.data = await this.getFriends();
		} else if (this.data.type === "requests") {
			this.id = "received-requests";
			this.header.textContent = "Received Friend Requests";
			this.UsersList.id = "requests";
			this._data.data = await this.getRequests();
		} else if (this.data.type === "blocked") {
			this.id = "blocked-users";
			this.header.textContent = "Blocked Users";
			this.UsersList.id = "blocked";
			this._data.data = await this.getBlockedUsers();
		}

		if (this._data.data.length == 0) {
			this.UsersList.innerHTML =
				"<p style='font-size:10px;color: var(--deep-blue);'>-- list is empty --</p>";
		} else {
			this._data.data.forEach((elem) => {
				const li = new FriendElement();
				li.data = { data: elem, type: this.data.type };
				this.UsersList.appendChild(li);
			});
		}
	}

	connectedCallback() {
		// NOTE: add event listener if clicked show user profile
		const clickHandler = () => {};
		this.addEventListener("click", clickHandler);
		this._clickListener = clickHandler;
	}
	disconnectedCallback() {
		if (this._clickListener) {
			this.removeEventListener("click", this._clickListener);
		}
	}
}

customElements.define("friend-card", FriendCardComponent, { extends: "div" });

export class FriendView extends HTMLElement {
	constructor() {
		super();
		this.header = document.createElement("p");
		this.header.textContent = "Friends Management";
		this.appendChild(this.header);
		this.mainContent = document.createElement("div");
		this.mainContent.className = "friend-container";
		this.appendChild(this.mainContent);
	}

	async connectedCallback() {
		// create list of users
		const allUsersCard = new FriendCardComponent();
		allUsersCard.data = {
			type: "all"
		};
		this.mainContent.appendChild(allUsersCard);

		const friendsCard = new FriendCardComponent();
		friendsCard.data = {
			type: "friends"
		};
		this.mainContent.appendChild(friendsCard);

		const requestsCard = new FriendCardComponent();
		requestsCard.data = {
			type: "requests"
		};
		this.mainContent.appendChild(requestsCard);

		const blockedCard = new FriendCardComponent();
		blockedCard.data = {
			type: "blocked"
		};
		this.mainContent.appendChild(blockedCard);
	}

	disconnectedCallback() {
		console.log("remove component from dom");
	}
}
