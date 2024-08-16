import API from "../../service/API.js";
import { ConvElement } from "./convComponent.js";

// TODO:
//  check if room already exist if not send request for it else
//  open the already existing room
async function makeChatRoom(user) {
	const ulElement = document.querySelector(".list-group");
	console.log("make makeChatRoom");
	console.log(ulElement);
	let respone = await API.createChatRoom(user);
	if (respone.ok) {
		respone = await respone.json();
		let conv = new ConvElement();
		conv.data = respone;
		console.log(conv);
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
		console.log(response);
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

window.addEventListener("click", async (event) => {
	let drop_down_menu = document.querySelector(".dropdown-content");
	if (!event.target.matches(".add-message-icon i")) {
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
