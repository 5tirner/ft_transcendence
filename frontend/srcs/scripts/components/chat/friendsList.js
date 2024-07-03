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
			userElem.textContent = elem.username;
			dropDown.appendChild(userElem);
		});
	}
}
