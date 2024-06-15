import API from "../../API.js";
import { convHeader } from "./conv_head.js";
import { formatTime, loadMessages } from "./messages_loader.js";

function createListItem(parentElement, convInfo, roomid) {
	// Create the main <li> element
	const listItem = document.createElement("li");
	listItem.className =
		"list-group-item d-flex align-items-center justify-content-between px-1";

	// Create the left part of the list item (profile and message)
	const leftDiv = document.createElement("div");
	leftDiv.className = "d-flex align-items-center";

	// div that contain user profile
	const profileContainer = document.createElement("div");
	profileContainer.className = "profile-container";

	// user profile image
	const profilePic = document.createElement("img");
	profilePic.src = convInfo.user.avatar;
	profilePic.alt = convInfo.user.username;
	profilePic.className = "profile-pic";

	profileContainer.appendChild(profilePic);

	const textContainer = document.createElement("div");
	textContainer.className = "mx-2";

	const usernameDiv = document.createElement("div");
	usernameDiv.className = "username";
	usernameDiv.textContent = convInfo.user.username;
	textContainer.appendChild(usernameDiv);

	const messageDiv = document.createElement("div");
	messageDiv.className = "message";
	messageDiv.textContent = convInfo.last_message.content;
	textContainer.appendChild(messageDiv);

	leftDiv.appendChild(profileContainer);
	leftDiv.appendChild(textContainer);

	const rightDiv = document.createElement("div");
	rightDiv.className = "d-flex align-items-center flex-column";
	const timeDiv = document.createElement("div");
	timeDiv.className = "time";
	if (convInfo.last_message.timestamp == null) timeDiv.textContent = "";
	else {
		const date = new Date(convInfo.last_message.timestamp);
		timeDiv.textContent = formatListDate(date);
	}
	rightDiv.appendChild(timeDiv);

	// TODO: add unreaded notify
	const notifDiv = document.createElement("div");
	if (
		convInfo.last_message.unreaded != null &&
		convInfo.last_message.unreaded != 0
	) {
		notifDiv.className = "notif mx-1 mt-2 visible";
		if (convInfo.last_message.unreaded <= 9)
			notifDiv.textContent = convInfo.last_message.unreaded;
		else notifDiv.textContent = "+9";
	} else {
		notifDiv.className = "notif mx-1 mt-2 invisible";
	}
	rightDiv.appendChild(notifDiv);

	// Append both left and right parts to the main <li> element
	listItem.appendChild(leftDiv);
	listItem.appendChild(rightDiv);

	// Append the <li> element to the <ul> parent element
	parentElement.appendChild(listItem);
	listItem.addEventListener("click", (event) => {
		const conv = document.querySelector(".chat-conv-wrapper");
		const messages = conv.querySelector(".messages");
		const convHeadParent = conv.querySelector(".chat-conv");
		const convHead = conv.querySelector(".conve-header");

		conv.style.display = "block";

		convHeadParent.removeChild(convHead);
		convHeadParent.insertBefore(
			convHeader(convInfo.user, roomid),
			convHeadParent.firstChild
		);
		loadMessages(messages, roomid);
		API.markMessagesAsRead(roomid);
		updateNotif(convInfo.user.username, true);
	});
}

export function updateNotif(username, toRemove = false) {
	const listItems = document.querySelectorAll(".list-group-item");

	// Loop through each list item
	for (const li of listItems) {
		const user = li.querySelector(".username");
		if (user.textContent == username) {
			const notif = li.querySelector(".notif");
			if (toRemove) {
				notif.classList.remove("visible");
				notif.classList.add("invisible");
				notif.textContent = "";
			} else {
				notif.classList.remove("invisible");
				notif.classList.add("visible");
				updateCounter(notif);
			}
			break;
		}
	}
}

function updateCounter(elem) {
	if (!elem.textContent) elem.textContent = "1";
	else {
		let mesgNumber = new Number(elem.textContent);
		mesgNumber++;
		if (mesgNumber > 9) elem.textContent = "+9";
		else elem.textContent = mesgNumber;
	}
}

export function formatListDate(date) {
	const today = new Date();

	const isToday = date.toDateString() === today.toDateString();
	if (isToday) {
		return `${formatTime(date)}`;
	} else {
		const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
		const day = String(date.getDate()).padStart(2, "0");
		const year = date.getFullYear();

		// Format the date and time as mm/dd/yyyy HH:MM am/pm
		return `${month}/${day}/${year}`;
	}
}

export async function getConversations() {
	const ulElement = document.querySelector("#chat ul");
	let response = await API.getConversatons();
	if (response.ok) {
		response = await response.json();
		response.forEach((chatConv) => {
			createListItem(ulElement, chatConv, chatConv.id);
		});
	}
}

// TODO: add does to the conv list
//
// TODO: status dot
// const statusDot = document.createElement("span");
// statusDot.className = "status-dot online";
// profileContainer.appendChild(statusDot);
//
// TODO: last message sent displayed
// display last message sent in chat
// const messageDiv = document.createElement('div');
// messageDiv.className = 'message';
// messageDiv.textContent = 'GG! I will win next time';
// textContainer.appendChild(messageDiv);
//
// TODO: to add
// time and unreaded messages count
// Create the right part of the list item (time and notification)
// const rightDiv = document.createElement('div');
// rightDiv.className = 'd-flex align-items-center flex-column';
// const timeDiv = document.createElement('div');
// timeDiv.className = 'time';
// timeDiv.textContent = '13:37PM';
// const notifDiv = document.createElement('div');
// notifDiv.className = 'notif mx-1 mt-2 visible';
// notifDiv.textContent = '+9';
// rightDiv.appendChild(timeDiv);
// rightDiv.appendChild(notifDiv);
// listItem.appendChild(rightDiv);
