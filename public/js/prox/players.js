const Players = {
  playersList: null,
};

const ProxiedPlayers = new Proxy(Players, {
  set(target, prop, value)
  {
    target[prop] = value;
   
    if ( prop === "playersList" )
      {
        window.dispatchEvent( new Event("playersListLoaded") );
      }

    return true;
  },
  get: (target, prop, receiver) => {
    return target[prop];
  },
});
export default ProxiedPlayers;