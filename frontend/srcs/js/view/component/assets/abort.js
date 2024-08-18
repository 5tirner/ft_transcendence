export const aborting = async (ws, game) => {
  console.log("Game aborted Good Bye");
  console.log("from aborting function game name: ", game);
  const self = document.getElementById(`${game}-view`);
  if ( self )
    self.remove();
  const toServer = { 'gameStatus': "closed", 'position': -1 };
  console.log(ws.CLOSED)
  if ( ws != null && (ws.readyState !== ws.CLOSED) )
    await ws.send(JSON.stringify(toServer));
  window.router.goto("/platform");
}