import API from "../../service/API.js";
import { socketResponsHandler, updateOnlineStatus } from "../friendsUpdate.js";
import { findUserInList, formatListDate, updateNotif } from "./chatList.js";
import { createMessageBuble } from "./messages_loader.js";

//NOTE: call here

function moveConvListTop(user_id) {
	const li = findUserInList(user_id);
	if (li) {
		const ul = li.parentNode;
		ul.prepend(li);
	}
}

let tracker = 0;

export function init_socket() {
	const chatSocket = new WebSocket("wss://127.0.0.1:8000/ws/chat/");
	const inputField = document.querySelector(".message-input input");

	document.friendship_ws = chatSocket;
	chatSocket.onmessage = function (e) {
		const data = JSON.parse(e.data);
		const msgdata = {};
		const mesgsElem = document.querySelector(".messages");
		const chatUser = document.querySelector(".username-conv");
		if (data.msg_type) {
			if ((chatUser && data.id == chatUser.user_id) || data.sent) {
				msgdata.content = data.message;
				msgdata.timestamp = new Date().toJSON();
				createMessageBuble(mesgsElem, msgdata, data.sent);
				changeLastDisplayedMessage(data);
				moveConvListTop(chatUser.user_id);
				const roomid = document
					.querySelector(".conve-header")
					.getAttribute("data-room-id");
				API.markMessagesAsRead(roomid);
			} else {
				changeLastDisplayedMessage(data, data.user);
				moveConvListTop(data.id);
				updateNotif(data.id);
			}
		} else if (data.status_type) {
			updateOnlineStatus(data);
		} else if (data.friendship_type) {
			socketResponsHandler(data);
		}
	};
	chatSocket.onclose = function (e) {
		if (!e.wasClean && e.code != 1006) {
			// console.log("Socket closed unexpectedly");
			if (tracker <= 30) {
				tracker++;
			} else tracker = 1;
			console.log(tracker);
			setTimeout(() => {
				init_socket();
			}, 1000 * tracker);
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

				const userId = document.querySelector(".username-conv").user_id;
				chatSocket.send(
					JSON.stringify({
						message: message,
						user: user,
						user_id: userId,
						room_id: roomId,
						type: "chat"
					})
				);
				inputField.value = "";
			}
		}
	});
}

function changeLastDisplayedMessage(data) {
	const li = findUserInList(data.id);

	if (li) {
		const content = data.message;
		if (content.length > 8)
			li.querySelector(".message").textContent =
				content.slice(0, 5) + "...";
		else li.querySelector(".message").textContent = content;

		li.querySelector(".time").textContent = formatListDate(new Date());
	}
}
