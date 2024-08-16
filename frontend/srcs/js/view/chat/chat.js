import API from "../../service/API.js";
import { getConversations } from "./chatList.js";
import { fillFriensList } from "./friendsList.js";
import { init_socket } from "./socketConnection.js";

export async function render_chat() {
	await getConversations();
	init_socket();
}

export class ChatComponent extends HTMLElement {
	constructor() {
		super();

		this.className = "right-window";
	}
	connectedCallback() {
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
						<div class="dropdown">
							<div class="dropdown-content">
								<div>user</div>
							</div>
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
	}
}
