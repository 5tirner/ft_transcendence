export function handleGameInvite({ room_code }) {
	if (window.pong_ws) {
		window.pong_ws.send(JSON.stringify({ gameStatus: "closed" }));
		window.pong_ws.close();
		window.pong_ws = undefined;
	}
	if (window.ttt_ws) {
		window.ttt_ws.send(JSON.stringify({ gameStatus: "closed" }));
		window.ttt_ws.close();
		window.ttt_ws = undefined;
	}
	window.router.game("pong-friend", room_code);
}
