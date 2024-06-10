import API from "../../API.js";

export async function loadMessages(messagesElem, roomId) {
	let messages = await API.getConvMessages(roomId);
	if (messages.ok) {
		messages = await messages.json();
		console.log(messages);
	}
}
