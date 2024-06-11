import { createMessageBuble } from "./messages_loader.js";

export function init_socket() {
	const chatSocket = new WebSocket("ws://127.0.0.1:8000/ws/chat/");
	const inputField = document.querySelector(".message-input");

	chatSocket.onmessage = function (e) {
		const data = JSON.parse(e.data);
		const msgdata = {};
		const mesgsElem = document.querySelector(".messages");
		msgdata.content = data.message;
		msgdata.timestamp = new Date().toJSON();
		createMessageBuble(mesgsElem, msgdata, data.sent);
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
