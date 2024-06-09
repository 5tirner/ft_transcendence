export function init_socket() {
	const chatSocket = new WebSocket("ws://127.0.0.1:8000/ws/chat/");

	chatSocket.onmessage = function (e) {
		const data = JSON.parse(e.data);
		console.log(e.data);
	};
	chatSocket.onclose = function (e) {
		console.error("chat socker closed");
	};
	const inputField = document.querySelector(".message-input");
	inputField.addEventListener("keydown", (event) => {
		if (event.key == "Enter") {
			if (inputField.value) {
				const message = inputField.value;
				const user =
					document.querySelector(".username-conv").textContent;
				chatSocket.send(
					JSON.stringify({
						message: message,
						user: user
					})
				);
				inputField.value = "";
			}
		}
	});
}
