import API from "../../service/API.js";
import { ConvElement } from "./convComponent.js";
import { fillFriensList, handlAddChatRoom } from "./friendsList.js";
import { init_socket } from "./socketConnection.js";

export default class ChatComponent extends HTMLElement {
	constructor() {
		super();
	}
	connectedCallback() {
		this.className = "right-window";
		this.setAttribute("id", "chat");
		this.innerHTML = `
			<div class="nav-convs">
				<!-- INFO: Head of Chat-->
				<div class="d-flex flex-column align-items-center justify-content-start text-center text-white p-1 mx-auto gap-2">
					<div class="add-message-head position-relative">
						<b>Chats</b>
						<div class="add-message-icon position-absolute">
							<i class="bi bi-plus-circle-fill"></i>
						</div>
					</div>
				</div>
				<!-- INFO:list of friends -->
				<ul class="list-group rounded-0 mt-2"></ul>
			</div>
			<div class="chat-conv-wrapper">
				<div class="chat-conv d-flex flex-column">
					<div class="conve-header"></div>
					<div class="messages d-flex flex-column"></div>
					<div class="input-bar">
						<div class="message-input">
							<input type="text" placeholder="Write your message" />
						</div>
					</div>
				</div>
			</div>
		`;
		this.list_group = this.querySelector("ul");
		this.loadConversations();
		init_socket();

		const addChatRoom = this.querySelector(".add-message-icon");
		if (addChatRoom)
			addChatRoom.addEventListener("click", handlAddChatRoom);
	}

	async loadConversations() {
		let response = await API.getConversatons();
		this.list_group.innerHTML = "";
		if (response.ok) {
			response = await response.json();
			response.forEach((chatConv) => {
				let conv = new ConvElement();
				conv.data = chatConv;
				this.list_group.appendChild(conv);
			});
		}
	}
}
customElements.define("chat-view", ChatComponent);
