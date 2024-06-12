export function renderHome() {
	document.querySelector("#nav_bar").style.display = "block";
	const home = document.querySelector("#home");
	home.style.display = "block";
	const title = document.createElement("h1");
	title.textContent = window.Auth.user;
	home.innerHTML = "";
	home.appendChild(title);
}
