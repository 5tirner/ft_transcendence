export function handleGameInvite({ room_code }) {
	// this
	// const ws = new WebSocket("wss://" + location.host + '/GameInvite/' + room_code);
	window.router.game("pong-friend", room_code);
}
