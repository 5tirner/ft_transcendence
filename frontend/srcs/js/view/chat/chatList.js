import API from "../../service/API.js";
import { convHeader } from "./conv_head.js";
import { formatTime, loadMessages } from "./messages_loader.js";
import { ConvElement } from "./convComponent.js";

export function updateNotif(username, toRemove = false) {
	const listItems = document.querySelectorAll(".list-group-item");

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
		return `${month}/${day}/${year}`;
	}
}

export async function getConversations() {
	const ulElement = document.querySelector(".list-group");
	let response = await API.getConversatons();
	if (response.ok) {
		response = await response.json();
		response.forEach((chatConv) => {
			let conv = new ConvElement();
			conv.data = chatConv;
			ulElement.appendChild(conv);
		});
	}
}
