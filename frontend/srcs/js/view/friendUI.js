import API from "../service/API.js";
import { friendUpdate } from "./friendsUpdate.js";

//const variables
export const ADD = "add";
export const BLK_USER = "block_u";
export const BLK_FRND = "block_f";
export const UNBLOCK = "unblock";
export const UNFRND = "unfriend";
export const ACC_REQ = "acc_f";
export const ADD_ROOM = "add_room";

export class FriendElement extends HTMLLIElement {
	constructor() {
		super();
		this._data = null;
		this.className = "user-item";
		this.avatar = this.createAvatar();
		this.username = this.createUsername();

		this.actionButtonsDiv = this.createActionButtonsDiv();
	}
	createActionButtonsDiv() {
		const actionButtonsDiv = document.createElement("div");
		actionButtonsDiv.className = "action-buttons";
		this.appendChild(actionButtonsDiv);
		// // Create and append the add friend button
		this.firstButton = document.createElement("button");
		this.firstButton.type = "button";
		this.firstButton.className = "icon-button add-friend";
		this.firstButtonIcon = document.createElement("i");
		this.firstButton.title = "Add friend";
		this.firstButtonIcon.className = "bi bi-person-plus-fill";
		this.firstButton.appendChild(this.firstButtonIcon);
		actionButtonsDiv.appendChild(this.firstButton);

		// // Create and append the block user button
		this.secondButton = document.createElement("button");
		this.secondButton.type = "button";
		this.secondButton.className = "icon-button block-user";
		this.secondButton.title = "Block user";
		this.secondButtonIcon = document.createElement("i");
		this.secondButtonIcon.className = "bi bi-person-x";
		this.secondButton.appendChild(this.secondButtonIcon);
		actionButtonsDiv.appendChild(this.secondButton);
		return actionButtonsDiv;
	}
	createUsername() {
		const username = document.createElement("span");
		username.className = "username";
		this.appendChild(username);
		return username;
	}
	createAvatar() {
		const avatarContainer = document.createElement("div");
		avatarContainer.className = "avatar-container";
		const avatar = document.createElement("img");
		avatar.className = "avatar";
		avatar.alt = "User avatar";
		const statusDiv = document.createElement("div");
		statusDiv.className = "online-status";
		avatarContainer.appendChild(avatar);
		this.avatarCnt = avatarContainer;
		this.appendChild(avatarContainer);
		this.status = statusDiv;
		return avatar;
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

		const acceptFriendEventHanlder = async () => {
			const res = await API.sendAndAcceptFriendRequest(
				this._data.data.id
			);
			const reJson = await res.json();
			const friendList = document.getElementById("friends-list");
			if (friendList) friendList.updateDOM();
			friendUpdate(this._data.data, ACC_REQ);
			this.remove();
		};
		const addFriendEventHandler = async () => {
			const res = await API.sendAndAcceptFriendRequest(
				this._data.data.id
			);
			const reJson = await res.json();
			friendUpdate(this._data.data, ADD);
			this.remove();
		};
		const blockEventHandler = async () => {
			const res = await API.blockUser(this._data.data.id);
			const blockes = document.getElementById("blocked-users");
			if (blockes) blockes.updateDOM();
			if (this.parentNode.id === "users")
				friendUpdate(this._data.data, BLK_USER);
			else if (this.parentNode.id === "friends")
				friendUpdate(this._data.data, BLK_FRND);
			this.remove();
			const convs = document.querySelector("chat-view");
			if (convs) convs.loadConversations();
		};
		const unfriendEventHandler = async () => {
			const res = await API.removeFriend(this._data.data.id);
			const allUsers = document.getElementById("all-users");
			if (allUsers) allUsers.updateDOM();
			friendUpdate(this._data.data, UNFRND);
			this.remove();
		};
		const unblockEventHandler = async () => {
			const res = await API.removeBlock(this._data.data.id);
			const allUsers = document.getElementById("all-users");
			if (allUsers) allUsers.updateDOM();
			friendUpdate(this._data.data, UNBLOCK);
			this.remove();
		};
		const addFriendFromBlock = async () => {
			const res = await API.removeBlock(this._data.data.id);
			const res1 = await API.sendAndAcceptFriendRequest(
				this._data.data.id
			);
			friendUpdate(this._data.data, ADD);
			this.remove();
		};
		this.avatar.src = this._data.data.avatar;
		this.username.textContent = this._data.data.username;
		if (this._data.type === "all") {
			this._clickListener1 = addFriendEventHandler;
			this._clickListener2 = blockEventHandler;
		} else if (this._data.type === "friends") {
			this.firstButton.className = "icon-button remove-friend";
			this.firstButtonIcon.className = "bi bi-person-dash-fill";
			this.firstButton.title = "remove friend";
			//event handlers
			this._clickListener1 = unfriendEventHandler;
			this._clickListener2 = blockEventHandler;
			// add status to friends to see there online status
			if (this._data.data.status === "OFF") this.classList.add("offline");
			this.avatarCnt.appendChild(this.status);
		} else if (this._data.type === "requests") {
			this.firstButton.className = "icon-button accept-friend";
			this.firstButtonIcon.className = "bi bi-person-check-fill";
			this.firstButton.title = "Accept request";
			// event handlers
			this._clickListener1 = acceptFriendEventHanlder;
			this._clickListener2 = blockEventHandler;
		} else if (this._data.type === "blocked") {
			this.secondButton.className = "icon-button unblock-user";
			this.secondButtonIcon.className = "bi bi-person-dash";
			this.secondButton.title = "Unblock user";
			//event handlers
			this._clickListener1 = addFriendFromBlock;
			this._clickListener2 = unblockEventHandler;
		}
		this.firstButton.addEventListener("click", this._clickListener1);
		this.secondButton.addEventListener("click", this._clickListener2);
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

export class CardComponent extends HTMLDivElement {
	constructor() {
		super();
		this._data = null;
		this.className = "friend-card";
		this.header = this.createHeader();
		this.UsersList = this.createUserList();
	}

	set data(value) {
		this._data = value;
		this.updateDOM();
	}

	get data() {
		return this._data;
	}

	createHeader() {
		const header = document.createElement("p");
		this.appendChild(header);
		return header;
	}

	createUserList() {
		const list = document.createElement("ul");
		this.appendChild(list);
		return list;
	}

	async fetchData(apiMethod) {
		const res = await apiMethod();
		if (res.ok) {
			const resJson = await res.json();
			return resJson.friendships || resJson;
		}
		return [];
	}

	async updateDOM() {
		if (!this._data) return;

		const config = {
			all: {
				id: "all-users",
				headerText: "All Users",
				apiMethod: API.getPlayers,
				listId: "users"
			},
			friends: {
				id: "friends-list",
				headerText: "Friends List",
				apiMethod: API.getFriends,
				listId: "friends"
			},
			requests: {
				id: "received-requests",
				headerText: "Received Friend Requests",
				apiMethod: API.getFriendRequest,
				listId: "requests"
			},
			blocked: {
				id: "blocked-users",
				headerText: "Blocked Users",
				apiMethod: API.getBlockedUsers,
				listId: "blocked"
			}
		};

		const { id, headerText, apiMethod, listId } = config[this._data.type];

		this.id = id;
		this.header.textContent = headerText;
		this.UsersList.id = listId;
		this._data.data = await this.fetchData(apiMethod);

		this.renderList();
	}

	renderList() {
		this.UsersList.innerHTML = "";

		if (!this._data.data || this._data.data.length === 0) {
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

	connectedCallback() {}
	disconnectedCallback() {}
}

customElements.define("friend-card", CardComponent, { extends: "div" });

export default class FriendView extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		this.header = this.createHeader("Friends Management");
		this.mainContent = this.createMainContent();
		["all", "friends", "requests", "blocked"].forEach((type) => {
			this.addCard(type);
		});
	}

	createHeader(text) {
		const header = document.createElement("p");
		header.textContent = text;
		this.appendChild(header);
		return header;
	}

	createMainContent() {
		const mainContent = document.createElement("div");
		mainContent.className = "friend-container";
		this.appendChild(mainContent);
		return mainContent;
	}

	addCard(type) {
		const card = new CardComponent();
		card.data = { type };
		this.mainContent.appendChild(card);
	}

	disconnectedCallback() {}
}
customElements.define("friend-view", FriendView);
