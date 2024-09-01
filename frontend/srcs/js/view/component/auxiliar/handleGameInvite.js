export function handleGameInvite({ room_code })
{
	// this
	console.log(room_code);
	const ws = new WebSocket("wss://" + location.host + '/GameInvite/' + room_code);
	let isGameStarted = false;
	let isGameEnded = false; 
	ws.onopen = function()
	{
		console.log('Join To The Game By Using Code: ' + room_code);
	}
	ws.onmessage = function(e)
	{
		console.log('Data From Server:');
		console.log(e.data);
		const Data = e.data;
		if (isGameStarted == false && isGameEnded == false)
		{
			if (Data.player2.length == 0)
				console.log("Game Not Started Yet");
			else
			{
				console.log("Game Is Started Now");
				isGameStarted = true;
			}
		}
		else if (isGameStarted == true && isGameEnded == false)
		{

		}
	}
}
