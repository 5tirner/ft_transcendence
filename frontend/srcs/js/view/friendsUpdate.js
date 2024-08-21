import {
	ADD,
	BLK_FRND,
	BLK_USER,
	UNBLOCK,
	UNFRND,
	ACC_REQ
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
	const { event, user } = data;
	const allUsers = document.getElementById("all-users");
	const friendsList = document.getElementById("friends-list");
	const friendsRequests = document.getElementById("received-requests");
	const blockedList = document.getElementById("blocked-users");
	if (event === ADD && allUsers && friendsRequests) {
		allUsers.updateDOM();
		friendsRequests.updateDOM();
	} else if ((event === BLK_USER || event === UNBLOCK) && allUsers) {
		allUsers.updateDOM();
	} else if ((event === BLK_FRND || event === ACC_REQ) && friendsList) {
		friendsList.updateDOM();
	} else if (event === UNFRND && allUsers && friendsList) {
		allUsers.updateDOM();
		friendsList.updateDOM();
	}
}

export function updateOnlineStatus(data) {
	let friendsList = document.getElementById("friends")
	if (friendsList)
	  friendsList = friendsList.getElementsByTagName("li");
  if (!friendsList)
    return;

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
