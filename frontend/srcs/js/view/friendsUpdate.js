import {
	ADD,
	BLK_FRND,
	BLK_USER,
	UNBLOCK,
	UNFRND,
	ACC_REQ,
	ADD_ROOM,
	GAME_INV
} from "./friendUI.js";

export function friendUpdate(user, event) {
	const socket = document.friendship_ws;
	if (socket)
		socket.send(
			JSON.stringify({
				event: event,
				user: user.username,
				user_id: user.id,
				type: "friendship"
			})
		);
}

export function socketResponsHandler(data) {
	console.log(data);
	const { event } = data;
	const allUsers = document.getElementById("all-users");
	const friendsList = document.getElementById("friends-list");
	const friendsRequests = document.getElementById("received-requests");
	const blockedList = document.getElementById("blocked-users");
	const list_users = document.querySelector("chat-view");
	if (event === ADD && allUsers && friendsRequests) {
		allUsers.updateDOM();
		friendsRequests.updateDOM();
	} else if ((event === BLK_USER || event === UNBLOCK) && allUsers) {
		allUsers.updateDOM();
		if (event === BLK_USER && list_users) list_users.loadConversations();
	} else if ((event === BLK_FRND || event === ACC_REQ) && friendsList) {
		friendsList.updateDOM();
		if (event === BLK_FRND && list_users) list_users.loadConversations();
	} else if (event === UNFRND && allUsers && friendsList) {
		allUsers.updateDOM();
		friendsList.updateDOM();
	} else if (event === ADD_ROOM && list_users) {
		list_users.loadConversations();
	} else if (event === GAME_INV) {
		// got game inv
	}
}

export function updateOnlineStatus(data) {
	let friendsList = document.getElementById("friends");
	if (friendsList) friendsList = friendsList.getElementsByTagName("li");
	if (!friendsList) return;

	for (let i = 0; i < friendsList.length; i++) {
		const friendItem = friendsList[i];
		const friendName = friendItem.querySelector(".username").textContent;
		if (friendName === data.user) {
			if (data.online) {
				friendItem.classList.remove("offline");
			} else {
				friendItem.classList.add("offline");
			}
			break;
		}
	}
}
