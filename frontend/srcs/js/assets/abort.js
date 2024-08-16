export const aborting = (ws, game) => {
  console.log("Game aborted Good Bye");
  const self = document.getElementById(`${game}-view`);
  if ( self )
    self.remove();
  const toServer = { 'gameStatus': "closed", 'position': -1 };
  ws.send(JSON.stringify(toServer));
  window.router.goto("/platform");
}