import API from "../../API.js";
import { getConversations } from "./chatList.js";
import { init_socket } from "./socketConnection.js";

export async function render_chat() {
	document.querySelector("#chat").style.display = "block";
	// await getConversations();
	init_socket();
}

var drop_down_menu = document.querySelector(".dropdown-content ");

window.addEventListener("click", (event) => {
	if (!event.target.matches(".add-message-icon img")) {
		console.log("window click ===> ", event);
		if (drop_down_menu.classList.contains("show")) {
			drop_down_menu.classList.remove("show");
		}
	} else {
		console.log("window click ===> ", event);
		if (drop_down_menu.classList.contains("show")) {
			drop_down_menu.classList.remove("show");
		} else {
			drop_down_menu.classList.add("show");
		}
	}
});
