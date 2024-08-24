import { aborting } from "../assets/abort.js";
import { socket } from "../assets/socket.js";

export default class ResultMsg extends HTMLElement
{
	constructor()
	{
		super();
		this.root = this.attachShadow({ mode: "open" });
	}
	
	connectedCallback()
	{
    this.initialize();
    this.render();
	}
	
	disconnectedCallback() {}
	
  render()
  {
    this.root.innerHTML = `
    <style>
      .container {
          backdrop-filter: blur(5px);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: row;
      }
      
      .player {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
      }
      
      .winner {
      }
      
      .loser {
      }
      
      .avatar {
         border-radius: 50%;
         width: 80px;
         height: 80px;
         object-fit: cover;
         position: relative;
         border: 2px solid var(--light-olive);
      }
      
      .info h2 {
        margin: 0 0 10px 0;
        color: var(--light-olive);
      }
      
      .info .result {
        margin: 0;
        color: var(--light-olive);
      }
      
      .home-button {
          font-size: 14px;
          font-weight: 300;
          text-transform: uppercase;
          letter-spacing: 1px;
          border: none;
          cursor: pointer;
          display: inline-block;
          cursor: pointer;
          padding: 10px 60px;
          border-radius: 8px;
          background-color: var(--teal);
          color: var(--light-olive);
          text-decoration: none;
          box-shadow: 0 0 0 3px #2f2e41, 0 6px 0 #2f2e41;
          transition: all 0.1s ease, background 0.3s ease;
          font-family: "Press Start 2P", sans-serif !important;
          position: absolute;
          left: 50%;
          bottom: 100px;
          transform: translate(-50%, 0);
      }
      
      .home-button:hover {
            background-color: #0056b3;
        }
        
        @media (max-width: 768px) {
            .player {
                width: 100%;
                max-width: 400px;
            }
        }
        
        @media (max-width: 480px) {
            .player {
                flex-direction: column;
                width: 100%;
                max-width: none;
            }
        
            .avatar {
                margin-right: 0;
                margin-bottom: 10px;
            }
        
            .container {
                padding: 10px;
            }
        
            .home-button {
                width: 100%;
                box-sizing: border-box;
            }
        }
      </style>
      <div class="container">
        <div class="player winner">  
          <img src="${this.data.winnerPic}" alt="Winner Avatar" class="avatar">
            <div class="info">
                <h2>${this.data.winner}</h2>
                <p class="result">${this.winnerMsg}</p>
            </div>
        </div>
        <a href="/paltform" class="home-button">Back</a>
        <div class="player loser">
            <img src="${this.data.loserPic}" alt="Loser Avatar" class="avatar">
            <div class="info">
                <h2>${this.data.loser}</h2>
                <p class="result">${this.loserMsg}</p>
            </div>
        </div>
      </div>
    `;
    
    const game = this.getAttribute("game");
    const returnHome = this.root.querySelector(".home-button");
   	returnHome.addEventListener("click", (e) => {
   		e.preventDefault();
   		aborting(socket.ws, game);
   	});
  }
  
  initialize()
  {
    this.data = JSON.parse( this.getAttribute("data"));
    this.winnerMsg = 'Congratulations! You won!';
    this.loserMsg = 'Better luck next time!';
    if ( this.data.res && this.data.res === 'DRAW' )
      this.winnerMsg = 'DRAW', this.loserMsg = 'DRAW'
  }
}
customElements.define("result-msg", ResultMsg);