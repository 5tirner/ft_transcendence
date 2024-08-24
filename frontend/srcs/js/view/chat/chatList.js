import API from "../../service/API.js";
import { formatTime, loadMessages } from "./messages_loader.js";
import { ConvElement } from "./convComponent.js";

export function updateNotif(id, toRemove = false) {
	const listItems = document.querySelectorAll(".list-group-item");

	for (const li of listItems) {
		const user = li.data.user.id;
		if (user == id) {
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

export function findUserInList(id) {
	const listItems = document.querySelectorAll(".list-group-item");
	if (!listItems) return null;

	// Loop through each list item
	for (const li of listItems) {
		const user_id = li.data.user.id;
		if (user_id == id) {
			return li;
		}
	}
	return null;
}
