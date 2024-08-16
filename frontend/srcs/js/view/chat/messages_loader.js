import API from "../../service/API.js";

export function formatTime(date) {
	let hours = date.getHours();
	const minutes = String(date.getMinutes()).padStart(2, "0");
	const ampm = hours >= 12 ? "PM" : "AM";
	hours = hours % 12;
	hours = hours ? hours : 12; // The hour '0' should be '12'
	const formattedHours = String(hours).padStart(2, "0");

	return `${formattedHours}:${minutes} ${ampm}`;
}

function formatDate(date) {
	const today = new Date();

	// Check if the given date is today
	const isToday = date.toDateString() === today.toDateString();

	if (isToday) {
		return `Today ${formatTime(date)}`;
	} else {
		// Extract parts of the date
		const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
		const day = String(date.getDate()).padStart(2, "0");
		const year = date.getFullYear();

		// Format the date and time as mm/dd/yyyy HH:MM am/pm
		return `${month}/${day}/${year} ${formatTime(date)}`;
	}
}

export function createMessageBuble(parrentDiv, msgData, sent = true) {
	// Create the main container element
	const messageContainer = document.createElement("div");
	if (sent)
		messageContainer.className = "sent-message-con d-flex flex-column";
	else messageContainer.className = "recv-message-con d-flex flex-column";

	// Create the message paragraph element
	const messageParagraph = document.createElement("p");
	if (sent) messageParagraph.className = "sent-message p-2 m-1";
	else messageParagraph.className = "recv-message p-2 m-1";
	messageParagraph.textContent = msgData.content;

	// Create the message time element
	const messageTime = document.createElement("div");
	if (sent) messageTime.className = "sent-message-time mx-1";
	else messageTime.className = "recv-message-time mx-1";
	const date = new Date(msgData.timestamp);
	const formatedDate = formatDate(date);
	messageTime.textContent = formatedDate;

	// Append message and time elements to the container
	messageContainer.appendChild(messageParagraph);
	messageContainer.appendChild(messageTime);

	parrentDiv.appendChild(messageContainer);
	parrentDiv.scroolY = 0;
	parrentDiv.scrollTop = parrentDiv.scrollHeight;
}

export async function loadMessages(messagesElem, roomId) {
	let messages = await API.getConvMessages(roomId);
	if (messages.ok) {
		messages = await messages.json();
		messages.forEach((msg) => {
			if (msg.username === window.Auth.user) {
				createMessageBuble(messagesElem, msg);
			} else {
				createMessageBuble(messagesElem, msg, false);
			}
		});
	}
}
