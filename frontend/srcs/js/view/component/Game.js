export default class Game extends HTMLElement
{
	constructor()
	{
  	super();
  	this.left = document.getElementById('left-view');
    this.right = document.getElementById('right-view');
	}
	
	connectedCallback()
	{
		this.setAttribute("id", "game-view");
    this.render();
	}
	
  render()
  {
    this.innerHTML += `
      <style>
          #ttt-view
          {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              gap: 100px;
              background-color: var(--dark-purple);
              color: var(--light-olive);
          }
          .game-section
          {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 95%;
              height: 100%;
              margin-bottom: 30px;
              position: relative;
          }
        

          .game-mode-section
          {
              .game-mode-title
              {
                  color: #fff;
                  padding: 10px 0;
              }
              .game-mode-component
              {
                  width: 100%;
                  display: flex;
                  flex-direction: row;
                  justify-content: space-around;
              }
              height: 230px;
              width: 90%;
              align-items: center;
          }   
      </style>
      <div class="game-section"></div>
    `;
    this.left.style.display = 'none';
    this.right.style.display = 'none';
  }
  
  disconnectedCallback()
  {
    this.left.style.display = 'flex';
    this.right.style.display = 'block';
  }
}
customElements.define("game-view", Game);