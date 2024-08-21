import API from "../../service/API.js";
import { socketResponsHandler, updateOnlineStatus } from "../friendsUpdate.js";
import { findUserInList, formatListDate, updateNotif } from "./chatList.js";
import { createMessageBuble } from "./messages_loader.js";

function moveConvListTop(username) {
	const li = findUserInList(username);
	if (li) {
		const ul = li.parentNode;
		ul.prepend(li);
	}
}

export function init_socket() {
	const chatSocket = new WebSocket("ws://127.0.0.1:8000/ws/chat/");
	const inputField = document.querySelector(".message-input input");

	document.friendship_ws = chatSocket;
	chatSocket.onmessage = function (e) {
		const data = JSON.parse(e.data);
		const msgdata = {};
		const mesgsElem = document.querySelector(".messages");
		const chatUser = document.querySelector(".username-conv");
		if (data.msg_type) {
			if ((chatUser && data.user == chatUser.textContent) || data.sent) {
				msgdata.content = data.message;
				msgdata.timestamp = new Date().toJSON();
				createMessageBuble(mesgsElem, msgdata, data.sent);
				changeLastDisplayedMessage(data, chatUser.textContent);
				moveConvListTop(chatUser.textContent);
				const roomid = document
					.querySelector(".conve-header")
					.getAttribute("data-room-id");
				API.markMessagesAsRead(roomid);
			} else {
				changeLastDisplayedMessage(data, data.user);
				moveConvListTop(data.user);
				updateNotif(data.user);
			}
		} else if (data.status_type) {
			updateOnlineStatus(data);
		} else if (data.friendship_type) {
			socketResponsHandler(data);
		}
	};
	chatSocket.onclose = function (e) {
		console.log("the socket is clooooosed");
		// console.error("chat socket closed: ", e);
		if (!e.wasClean) {
			console.log("not clean closing ");
			init_socket();
		}
	};
	inputField.addEventListener("keydown", (event) => {
		if (event.key == "Enter") {
			if (inputField.value) {
				const roomId = document
					.querySelector(".conve-header")
					.getAttribute("data-room-id");
				const message = inputField.value;
				const user =
					document.querySelector(".username-conv").textContent;
				chatSocket.send(
					JSON.stringify({
						message: message,
						user: user,
						room_id: roomId,
						type: "chat"
					})
				);
				inputField.value = "";
			}
		}
	});
}

function changeLastDisplayedMessage(data, username) {
	const listItems = document.querySelectorAll(".list-group-item");

	// Loop through each list item
	for (const li of listItems) {
		const user = li.querySelector(".username");
		if (user.textContent == username) {
			const content = data.message;
			if (content.length > 8)
				li.querySelector(".message").textContent =
					content.slice(0, 5) + "...";
			else li.querySelector(".message").textContent = content;

			li.querySelector(".time").textContent = formatListDate(new Date());
			break;
		}
	}
}
