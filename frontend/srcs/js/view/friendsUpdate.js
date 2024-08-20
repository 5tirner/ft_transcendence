// TODO: add friend live update
//    remove user from all users list of current user
//    and remove it from the user who recived request
//    add current user to friend requests of other user
//
// TODO: block friend
// TODO: add friend live update
// TODO: add friend live update
// TODO: add friend live update
// TODO: add friend live update

//NOTE: used for addFriend from all users and from blocked users
export function addFriendUpdate(user) {
	const socket = document.friendship_ws;
	if (socket)
		socket.send(
			JSON.stringify({
				event: "add",
				user: user.username,
				user_id: user.id,
				type: "friendship"
			})
		);
}

//NOTE: used when blocking a user from all users
export function blockUserUpdate(user) {
	const socket = document.friendship_ws;
	if (socket)
		socket.send(
			JSON.stringify({
				event: "block_u",
				user: user.username,
				user_id: user.id,
				type: "friendship"
			})
		);
}

//NOTE: used when blocking friend
export function blockFriendUpdate(user) {
	// send to socket username that did get blocked
	// and update his friends list
	const socket = document.friendship_ws;
	if (socket)
		socket.send(
			JSON.stringify({
				event: "block_f",
				user: user.username,
				user_id: user.id,
				type: "friendship"
			})
		);
}

//NOTE: used when accepting friend request
export function acceptFriendUpdate(user) {
	// send to socket username that did get accepted
	// and update his friend list
	const socket = document.friendship_ws;
	if (socket)
		socket.send(
			JSON.stringify({
				event: "acc_f",
				user: user.username,
				user_id: user.id,
				type: "friendship"
			})
		);
}

//NOTE: used when user unfriend his friend
export function unfriendUpdate(user) {
	// send to socket username that did get unfriended
	// and update his friend list and all users
	const socket = document.friendship_ws;
	if (socket)
		socket.send(
			JSON.stringify({
				event: "unfriend",
				user: user.username,
				user_id: user.id,
				type: "friendship"
			})
		);
}

//NOTE: used when user unblock user
export function unblockUpdate(user) {
	// send to socket username that did get unblocked
	// and update his all users
	const socket = document.friendship_ws;
	if (socket)
		socket.send(
			JSON.stringify({
				event: "unblock",
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
	if (event === "add") {
		// and update his receiver friend requests and all Users
		if (allUsers) allUsers.updateDOM();
		if (friendsRequests) friendsRequests.updateDOM();
	} else if (event === "block_u") {
		// and update his all Users
		if (allUsers) allUsers.updateDOM();
	} else if (event === "block_f") {
		// and update his friends list
		if (friendsList) friendsList.updateDOM();
	} else if (event === "acc_f") {
		// and update his friend list
		if (friendsList) friendsList.updateDOM();
	} else if (event === "unfriend") {
		// and update his friend list and all users
		if (allUsers) allUsers.updateDOM();
		if (friendsList) friendsList.updateDOM();
	} else if (event === "unblock") {
		// and update his all users
		if (allUsers) allUsers.updateDOM();
	}
}
