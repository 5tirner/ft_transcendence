import API from "../../services/API.js";
import { getConversations } from "./chatList.js";
import { fillFriensList } from "./friendsList.js";
import { init_socket } from "./socketConnection.js";

export async function render_chat() {
	await getConversations();
	init_socket();
}
