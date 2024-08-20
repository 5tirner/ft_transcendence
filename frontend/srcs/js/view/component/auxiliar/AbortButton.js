export default class AbortButton extends HTMLElement
{
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("class", "abort");
    this.render();
    this.logic();
  }
	
  disconnectedCallback() {
    this.removeEventListener("click", this.listener);
  }
  
  render() {
    this.innerHTML = `
        <style>
          .abort {
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
            background-color: var(--coral);
            color: var(--light-olive);
            box-shadow: 0 0 0 3px #2f2e41, 0 6px 0 #2f2e41;
            transition: all 0.1s ease, background 0.3s ease;
            font-family: "Press Start 2P", sans-serif !important;
          }
        </style>
        EXIT
      `;
  }
  
  logic() {
    const parent = this.parentNode;
    const confirmMsg = parent.querySelector("confirm-msg");
    this.cancel = confirmMsg.querySelector(".btn-cancel");
    this.leave = confirmMsg.querySelector(".btn-primary");
    this.listener = () => {
      confirmMsg.setAttribute("style", "display: block");
    };
    this.addEventListener("click", this.listener);
  }
}
customElements.define("abort-btn", AbortButton);