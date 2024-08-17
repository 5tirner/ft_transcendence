import API from "../../service/API.js";
import { findUserInList } from "./chatList.js";
import { ConvElement } from "./convComponent.js";

async function makeChatRoom(user) {
	const userLi = findUserInList(user);
	if (userLi) {
		userLi.click();
	} else {
		const ulElement = document.querySelector(".list-group");

		let respone = await API.createChatRoom(user);
		if (respone.ok) {
			respone = await respone.json();
			let conv = new ConvElement();
			conv.data = respone;
			ulElement.appendChild(conv);
			ulElement.insertBefore(conv, ulElement.firstChild);
			conv.click();
		}
	}
}

export async function fillFriensList(popup) {
	let response = await API.getFriends();
	const popupSubDiv = popup.querySelector(".pop-up");
	popupSubDiv.innerHTML = "";
	if (response.ok) {
		response = await response.json();
		const { friendships } = response;
		console.log(friendships);
		friendships.forEach((elem) => {
			const userElem = document.createElement("div");
			userElem.addEventListener("click", async (event) => {
				await makeChatRoom(event.target.textContent);
				popup.remove();
			});
			userElem.textContent = elem.username;
			popupSubDiv.appendChild(userElem);
		});
	}
}

export class PopupFriendList extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		this.setAttribute("id", "friends-list");
		this.innerHTML = `
			<div class="pop-up">
                this is some text
			</div>`;
	}
}
customElements.define("pop-up-friend-list", PopupFriendList);

export async function handlAddChatRoom(event) {
	let popup = document.querySelector("pop-up-friend-list");
	if (popup) {
		popup.remove();
	} else {
		popup = document.createElement("pop-up-friend-list");
		document.querySelector("body").appendChild(popup);
		fillFriensList(popup);
	}
}

window.addEventListener("click", (event) => {
	const addChatRoom = document.querySelector(
		"#chat > div.nav-convs > div > div > div > i"
	);
	const popup = document.querySelector("pop-up-friend-list");
	if (popup && !popup.contains(event.target) && event.target != addChatRoom) {
		popup.remove();
	}
});
