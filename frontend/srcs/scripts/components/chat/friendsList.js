import API from "../../API.js";
import { ConvElement } from "./convComponent.js";

async function makeChatRoom(user) {
	const ulElement = document.querySelector(".list-group");
	let respone = await API.createChatRoom(user);
	if (respone.ok) {
		respone = await respone.json();
		let conv = new ConvElement();
		conv.data = respone;
		ulElement.appendChild(conv);
		ulElement.insertBefore(conv, ulElement.firstChild);
	}
}

export async function fillFriensList(params) {
	let response = await API.getFriends();
	const dropDown = document.querySelector(".dropdown-content");
	dropDown.innerHTML = "";
	if (response.ok) {
		response = await response.json();
		const { friendships } = response;
		friendships.forEach((elem) => {
			const userElem = document.createElement("div");
			userElem.addEventListener("click", async (event) => {
				await makeChatRoom(event.target.textContent);
			});
			userElem.textContent = elem.username;
			dropDown.appendChild(userElem);
		});
	}
}

var drop_down_menu = document.querySelector(".dropdown-content ");

window.addEventListener("click", async (event) => {
	if (!event.target.matches(".add-message-icon img")) {
		if (drop_down_menu.classList.contains("show")) {
			drop_down_menu.classList.remove("show");
		}
	} else {
		if (drop_down_menu.classList.contains("show")) {
			drop_down_menu.classList.remove("show");
		} else {
			await fillFriensList();
			drop_down_menu.classList.add("show");
		}
	}
});
