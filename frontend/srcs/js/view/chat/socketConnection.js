import API from "../../service/API.js";
import { formatListDate, updateNotif } from "./chatList.js";
import { createMessageBuble } from "./messages_loader.js";

function moveConvListTop(username) {
	const listItems = document.querySelectorAll(".list-group-item");

	// Loop through each list item
	for (const li of listItems) {
		const user = li.querySelector(".username");
		if (user.textContent == username) {
			console.log(li);
			const ul = li.parentNode;
			ul.prepend(li);
			break;
		}
	}
}

export function init_socket() {
	const chatSocket = new WebSocket("ws://127.0.0.1:8000/ws/chat/");
	const inputField = document.querySelector(".message-input input");

	chatSocket.onmessage = function (e) {
		const data = JSON.parse(e.data);
		const msgdata = {};
		const mesgsElem = document.querySelector(".messages");
		const chatUser = document.querySelector(".username-conv");
		console.log(data);
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
		}
	};
	chatSocket.onclose = function (e) {
		console.error("chat socket closed", e.reason);
		init_socket();
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
						room_id: roomId
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
			li.querySelector(".message").textContent = data.message;
			li.querySelector(".time").textContent = formatListDate(new Date());
			break;
		}
	}
}
