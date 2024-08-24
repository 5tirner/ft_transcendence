export default class PongAnim extends HTMLElement
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
        :host {
          display: flex;
          width: 100%;
          height: 100%;
          justify-content: center;
          align-items: center;
        }
        .pong-container {
          position: relative;
          margin: 0 auto;
          width: 75%;
          height: 75%;
          color: var(--light-olive);
        }
        
        .paddle-left, .paddle-right {
          position: absolute;
          width: 5px;
          height: 40px;
          background-color: white;
        }
        
        .paddle-left {
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          animation: movePaddleLeft 2s infinite alternate ease-in-out;
        }
        
        .paddle-right {
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          animation: movePaddleRight 2s infinite alternate ease-in-out;
        }
        
        .ball {
          position: absolute;
          width: 12px;
          height: 12px;
          background-color: white;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: moveBall 4s infinite linear;
        }
        
        @keyframes movePaddleLeft {
          0% { top: 30%; }
          100% { top: 70%; }
        }
        
        @keyframes movePaddleRight {
          0% { top: 70%; }
          100% { top: 30%; }
        }
        
        @keyframes moveBall {
          0%, 100% { left: 10%; top: 30%; }
          25% { left: 90%; top: 50%; }
          50% { left: 10%; top: 70%; }
          75% { left: 90%; top: 50%; }
        }
      </style>
      <div class="pong-container">
        <div class="title">${title || 'title'}</div>
        <div class="paddle-left"></div>
        <div class="paddle-right"></div>
        <div class="ball"></div>
      </div>
    `
  }
}
customElements.define("pong-animation", PongAnim);