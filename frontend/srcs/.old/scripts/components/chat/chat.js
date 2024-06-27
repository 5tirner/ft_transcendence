import API from "../../API.js";
import { getConversations } from "./chatList.js";
import { init_socket } from "./socketConnection.js";

export async function render_chat() {
	document.querySelector("#chat").style.display = "block";
	await getConversations();
	init_socket();
}
