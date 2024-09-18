export function handleGameInvite({ room_code }) {
	// this
	// const ws = new WebSocket("wss://" + location.host + '/GameInvite/' + room_code);
	
	console.log(window.ttt_ws)
	console.log(window.pong_ws)
	if (window.pong_ws)
	{
			window.pong_ws.send(JSON.stringify({'gameStatus': 'closed'}));
	}
	if (window.ttt_ws)
	{
		window.ttt_ws.send(JSON.stringify({'gameStatus': 'closed'}));
	}
	window.router.game("pong-friend", room_code);
}
