export default class TicAnim extends HTMLElement
{
  constructor()
  {
    super();
    this.root = this.attachShadow({ mode: "open" });
  }
  connectedCallback()
  {
    const title = this.getAttribute("title");
    this.root.innerHTML = `
      <style>
        .tic-tac-toe-container {
            display: grid;
            grid-template-columns: repeat(3, 60px);
            grid-template-rows: repeat(3, 60px);
            gap: 5px;
            margin-top: 20px;
        }
        
        .cell {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 18px;
            font-weight: bold;
            color: var(--light-olive);
            position: relative;
            overflow: hidden;
        }
        
        .x-swing, .o-swing {
            animation: swing 2s infinite ease-in-out;
        }
        
        @keyframes swing {
            0% { transform: rotate(0deg); }
            25% { transform: rotate(15deg); }
            50% { transform: rotate(0deg); }
            75% { transform: rotate(-15deg); }
            100% { transform: rotate(0deg); }
        }
      </style>
      <div>${title || 'title'}</div>
      <div class="tic-tac-toe-container">
        <div class="cell">
            <div class="x-swing">X</div>
        </div>
        <div class="cell">
            <div class="o-swing">O</div>
        </div>
        <div class="cell">
            <div class="x-swing">X</div>
        </div>
        <div class="cell">
            <div class="o-swing">O</div>
        </div>
        <div class="cell">
            <div class="x-swing">X</div>
        </div>
        <div class="cell">
            <div class="o-swing">O</div>
        </div>
        <div class="cell">
            <div class="x-swing">X</div>
        </div>
        <div class="cell">
            <div class="o-swing">O</div>
        </div>
        <div class="cell">
            <div class="x-swing">X</div>
        </div>
    </div>
    `;
  }
}
customElements.define("tic-tac-toe-anim", TicAnim);