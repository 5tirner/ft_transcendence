import API from "../../API.js";
export async function fillFriensList(params) {
	let response = await API.getFriends();
	const dropDown = document.querySelector(".dropdown-content");
	dropDown.innerHTML = "";
	if (response.ok) {
		response = await response.json();
		const { friendships } = response;
		friendships.forEach((elem) => {
			const userElem = document.createElement("div");
			userElem.addEventListener("click", (event) => {
				console.log(event);
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
