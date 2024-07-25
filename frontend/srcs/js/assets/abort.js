export const aborting = () => {
  const self = document.getElementById('ttt-view');
  if ( self )
    self.remove();
  const toServer = { 'gameStatus': "closed", 'position': -1 };
  window.ws.send(JSON.stringify(toServer));
  window.router.redirecto("/platform");
}