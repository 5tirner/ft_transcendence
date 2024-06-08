import API from "../API.js";
import { getConversations } from "./chatList.js";

function createMessageBuble(parrentDiv, msgData) {
	// Create the main container element
	const messageContainer = document.createElement("div");
	messageContainer.className = "recv-message-con d-flex flex-column";

	// Create the message paragraph element
	const messageParagraph = document.createElement("p");
	messageParagraph.className = "recv-message p-2 m-1";
	messageParagraph.textContent = msgData.message;

	// Create the message time element
	const messageTime = document.createElement("div");
	messageTime.className = "recv-message-time mx-1";
	messageTime.textContent = msgData.date;

	// Append message and time elements to the container
	messageContainer.appendChild(messageParagraph);
	messageContainer.appendChild(messageTime);

	return messageContainer;
}

function init_socket() {
	const chatSocket = new WebSocket("ws://127.0.0.1:8000/ws/chat/");

	chatSocket.onmessage = function (e) {
		const data = JSON.parse(e.data);
		console.log(e.data);
	};
	chatSocket.onclose = function (e) {
		console.error("chat socker closed");
	};
	const inputField = document.querySelector(".search");
	inputField.addEventListener("keydown", (event) => {
		if (event.key == "Enter") {
			if (inputField.value) {
				const message = inputField.value;
				chatSocket.send(
					JSON.stringify({
						message: message
					})
				);
				inputField.value = "";
			}
		}
	});
}

export async function render_chat() {
	document.querySelector("#chat").style.display = "block";
	await getConversations();
	init_socket();
}
