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

		this.avatar.src = this._data.data.avatar;
		this.username.textContent = this._data.data.username;
		if (this._data.type === "friends") {
			this.firstButton.className = "icon-button remove-friend";
			this.firstButtonIcon.className = "bi bi-person-dash-fill";
			this.firstButton.title = "remove friend";
		} else if (this._data.type === "requests") {
			this.firstButton.className = "icon-button accept-friend";
			this.firstButtonIcon.className = "bi bi-person-check-fill";
			this.firstButton.title = "Accept request";
		} else if (this._data.type === "blocked") {
			this.secondButton.className = "icon-button unblock-user";
			this.secondButtonIcon.className = "bi bi-person-dash";
			this.secondButton.title = "Unblock user";
		}
	}

	connectedCallback() {
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

customElements.define("friend-li", FriendElement, { extends: "li" });

export class FriendCardComponent extends HTMLDivElement {
	constructor() {
		super();
		this._data = null;
		this.className = "friend-card";
		this.header = document.createElement("p");
		this.appendChild(this.header);
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

		const UsersList = document.createElement("ul");
		if (this._data.type === "all") {
			this.id = "all-users";
			this.header.textContent = "All Users";
			UsersList.id = "users";
		} else if (this.data.type === "friends") {
			this.id = "friends-list";
			this.header.textContent = "Friends List";
			UsersList.id = "friends";
		} else if (this.data.type === "requests") {
			this.id = "received-requests";
			this.header.textContent = "Received Friend Requests";
			UsersList.id = "requests";
		} else if (this.data.type === "blocked") {
			this.id = "blocker-users";
			this.header.textContent = "Blocked Users";
			UsersList.id = "blocked";
		}

		this._data.data.forEach((elem) => {
			const li = new FriendElement();
			li.data = { data: elem, type: this.data.type };
			UsersList.appendChild(li);
		});
		this.appendChild(UsersList);
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
		this.allUsers = null;
		this.blockedUsers = null;
		this.friends = null;
		this.friendRequests = null;
	}
	async getFriends() {
		const res = await API.getFriends();
		if (res.ok) {
			this.friends = await res.json();
			this.friends = this.friends.friendships;
		}
	}

	async getAllUsers() {
		const res = await API.getPlayers();
		if (res.ok) {
			this.allUsers = await res.json();
		}
	}
	async connectedCallback() {
		await this.getAllUsers();
		await this.getFriends();
		console.log(this.allUsers);
		console.log(this.friends);

		// create list of users
		const allUsersCard = new FriendCardComponent();
		allUsersCard.data = {
			data: this.allUsers,
			type: "all"
		};
		this.mainContent.appendChild(allUsersCard);

		const friendsCard = new FriendCardComponent();
		friendsCard.data = {
			data: this.friends,
			type: "friends"
		};
		this.mainContent.appendChild(friendsCard);

		const requestsCard = new FriendCardComponent();
		requestsCard.data = {
			data: this.friends,
			type: "requests"
		};
		this.mainContent.appendChild(requestsCard);

		const blockedCard = new FriendCardComponent();
		blockedCard.data = {
			data: this.friends,
			type: "blocked"
		};
		this.mainContent.appendChild(blockedCard);
	}

	disconnectedCallback() {
		console.log("remove component from dom");
	}
}

// <div class="friend-card" id="friends-list">
// 	<p>Friends List</p>
// 	<ul id="friends">
//                  <li class='user-item'>
//                      <img src="https://cdn.intra.42.fr/users/7e57e4d04af367214c4a7e33fa9aa6bc/belkarto.JPG" alt="User Avatar" class="avatar">
//                      <span class="username">belkarto</span>
//                      <div class="action-buttons">
//                          <button type="button" class="icon-button remove-friend" title="remove frind">
//                              <i class="bi bi-person-dash-fill"></i>
//                          </button>
//                          <button type="button" class="icon-button block-user" title="Block user">
//                              <i class="bi bi-person-x"></i>
//                          </button>
//                      </div>
//                  </li>
//              </ul>
// </div>
//
// <div class="friend-card" id="received-requests">
// 	<p>Received Friend Requests</p>
// 	<ul id="requests">
//                  <li class='user-item'>
//                      <img src="https://cdn.intra.42.fr/users/7e57e4d04af367214c4a7e33fa9aa6bc/belkarto.JPG" alt="User Avatar" class="avatar">
//                      <span class="username">belkarto</span>
//                      <div class="action-buttons">
//                          <button type="button" class="icon-button accept-friend" title="Accept friend">
//                              <i class="bi bi-person-check-fill"></i>
//                          </button>
//                          <button type="button" class="icon-button block-user" title="Block user">
//                              <i class="bi bi-person-x"></i>
//                          </button>
//                      </div>
//                  </li>
//              </ul>
// </div>
//
// <div class="friend-card" id="blocked-users">
// 	<p>Blocked Users</p>
// 	<ul id="blocked">
//                  <li class='user-item'>
//                      <img src="https://cdn.intra.42.fr/users/7e57e4d04af367214c4a7e33fa9aa6bc/belkarto.JPG" alt="User Avatar" class="avatar">
//                      <span class="username">belkarto</span>
//                      <div class="action-buttons">
//                          <button type="button" class="icon-button add-friend" title="Add friend">
//                              <i class="bi bi-person-plus-fill"></i>
//                          </button>
//                          <button type="button" class="icon-button unblock-user" title="Unblock user">
//                              <i class="bi bi-person-dash"></i>
//                          </button>
//                      </div>
//                  </li>
//              </ul>
// </div>
