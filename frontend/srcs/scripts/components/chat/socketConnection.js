import { formatListDate } from "./chatList.js";
import { createMessageBuble } from "./messages_loader.js";

export function init_socket() {
	const chatSocket = new WebSocket("ws://127.0.0.1:8000/ws/chat/");
	const inputField = document.querySelector(".message-input");

	chatSocket.onmessage = function (e) {
		const data = JSON.parse(e.data);
		const msgdata = {};
		const mesgsElem = document.querySelector(".messages");
		const chatUser = document.querySelector(".username-conv");
		if (data.msg_type) {
			if (data.user == chatUser.textContent || data.sent) {
				msgdata.content = data.message;
				msgdata.timestamp = new Date().toJSON();
				createMessageBuble(mesgsElem, msgdata, data.sent);
			} else {
				changeLastDisplayedMessage(data);
			}
		} else {
			console.log(data);
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

function changeLastDisplayedMessage(data) {
	const listItems = document.querySelectorAll(".list-group-item");

	// Loop through each list item
	for (const li of listItems) {
		const user = li.querySelector(".username");
		if (user.textContent == data.user) {
			console.log(user.textContent);
			li.querySelector(".message").textContent = data.message;
			li.querySelector(".time").textContent = formatListDate(new Date());
			break;
		}
	}
}
