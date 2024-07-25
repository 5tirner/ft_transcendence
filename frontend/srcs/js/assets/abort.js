export const aborting = (ws) => {
  const self = document.getElementById('ttt-view');
  if ( self )
    self.remove();
  const toServer = { 'gameStatus': "closed", 'position': -1 };
  ws.send(JSON.stringify(toServer));
  window.router.redirecto("/platform");
}