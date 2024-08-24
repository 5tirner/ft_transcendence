export default class Platform extends HTMLElement 
{
	constructor()
	{
		super();
		this.root = this.attachShadow({ mode: "open" });
	}
	
	connectedCallback()
	{
		this.setAttribute("id", "platform-view");
    this.render();
    this.initialize()	
	}

	disconnectedCallback()
	{
		this.startGame.forEach((elem) => {
			elem.removeEventListener("click", (e) => {
				e.preventDefault();
				const game = e.target.getAttribute("game");
				this.manipulateGameSection(game);
			});
		});
	}
	
	render()
	{
	this.root.innerHTML +=
	`
      <style>
         a{
               text-decoration: none;
         }
         .container{
            width: 100%;
            height: 50%;
         }
         .wrapper{
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            width: 80%;
            height: 80%;
         }
         .pong, .xo, .tour
         {
            display: flex;
            align-items: center;
            width: 330px;
            position: relative;
            background-color: var(--dark-purple);
            
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
            border-radius: 12px;
         }
         .pong
         {
            
            text-align: center;
            justify-content: center;
            
         }
         .xo
         {
            flex-direction: column;
            padding-top: 45px;
            color: var(--light-olive);
         }
         .btn-wrapper
         {
               width: 100%;
               position: absolute;
               bottom: 24px;
               left: 0;
               display: flex;
               justify-content: space-around;
         }
         .button 
         {
            font-size: 10px;
            font-weight: 300;
            text-transform: uppercase;
            letter-spacing: 1px;
            border: none;
            cursor: pointer;
            display: inline-block;
            padding: 2.5% 6%;
            border-radius: 8px;
            background-color: var(--dark-teal);
            color: var(--light-olive);
            box-shadow: 0 0 0 3px #2f2e41, 0 6px 0 #2f2e41;
            transition: all 0.1s ease, background 0.3s ease;
            font-family: "Press Start 2P", sans-serif !important;
         }
         .po-local
         {
               background: var(--coral) !important;
         }
         .local-xo
         {
               background: var(--light-olive) !important;
               color: var(--coral);
         }
         .button:hover,
         .button:focus
         {
               background: #df6108;
         }
         .rank
         {
               margin-top: 80px;
               width: 100%;
               height: 55%;
               display: flex;
               flex-direction: column;
               align-items: center;
         }
         .rank-title
         {
            padding: 10px 0;
            width: 100%;
            text-align: center;
            color: var(--dark-purple);
         }
         
         .rank:hover .slide
         {
               animation-play-state: paused;
         }
         @keyframes sliding
         {
               from{ transform: translateX(80%); }
               to{ transform: translateX(-100%); }
         }
         .slide
         {
               width: 100%;
               height: 100%;
               display: flex;
               flex-direction: row;
               justify-content: center;
               gap: 2.5rem;
               animation: 20s sliding infinite linear;
         }
         @media screen and (max-width: 1300px) {
            .container {
               // width: 100%;
               // height: 35%;
               // display: flex;
               // flex-direction: column;
               // justify-content: center;
               // align-items: center;
            }
            .wrapper
            {
               display: flex;
               flex-direction: column;
               align-items: center;
               gap: 40px;
            }
            .rank
            {
               display: none;
            }
         }
      </style>
      <div class="container">
         <div class="wrapper">
            <div class="pong">
                  <pong-animation title="PONG"></pong-animation>
                  <div class="btn-wrapper">
                     <a href="/game" class="button po-btn multi common" game="pong">
                        Multiplayer
                     </a>
                     <a href="/game" class="button po-local multi common" game="po-local">
                        Local
                     </a>
                  </div>
            </div>
            <div class="xo">
               <tic-tac-toe-anim title="TIC TAC TOE"></tic-tac-toe-anim>
               <div class="btn-wrapper">
                  <a href="/game" class="button xo-btn multi common" game="ttt">
                     Multiplayer
                  </a>
               </div>
            </div>
            <div class="tour">
                  <pong-animation title="PONG TOURNAMENT"></pong-animation>
                  <div class="btn-wrapper">
                     <a href="/game" class="button po-btn-tour multi common" game="tournament">
                        Tournament
                     </a>
                  </div>
            </div>
         </div>
      </div>
   `
	}
	
	initialize()
  {
    this.startGame = this.root.querySelectorAll(".common");
    
    this.startGame.forEach((elem) => {
        elem.addEventListener("click", (e) => {
          e.preventDefault();
          const _game = e.target.getAttribute("game");
          window.router.game(_game);
        });
    });
  }
}
customElements.define("platform-view", Platform);