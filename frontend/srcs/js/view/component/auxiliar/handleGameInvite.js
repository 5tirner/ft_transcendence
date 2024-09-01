export function handleGameInvite({ room_code })
{
	console.log(room_code);
	const ws = new WebSocket("wss://" + location.host + '/GameInvite/' + room_code);
	ws.onopen = function()
	{
		console.log('Join To The Game By Using Code: ' + room_code);
	}
	ws.onmessage = function(e)
	{
		console.log('Data From Server:');
		console.log(e.data);
	}
}
