import { aborting } from "../assets/abort.js";
import { socket } from "../assets/socket.js";

export default class ConfirmMsg extends HTMLElement
{
	constructor()
	{
		super();
		this.root = this.attachShadow({ mode: "open" });
	}
	
	connectedCallback()
	{
		this.setAttribute("id", "confirm-msg");
		this.setAttribute("style", "display: none");
		
    this.render();
    
		const game = this.getAttribute("game");
		this.cancel = this.root.querySelector(".btn-cancel");
		this.leave = this.root.querySelector(".btn-primary");

		window.onpopstate = () => {
			history.replaceState(
				{ path: "/game" },
				null,
				location.origin + "/game"
			);
			this.setAttribute("style", "display: block");
		};
		
		this.fcancel = () => {
			this.setAttribute("style", "display: none");
		};
		this.fleave = () => {
			this.setAttribute("style", "display: none");
			console.log("which game would be removed: ", game);
			aborting(socket.ws, game);
			window.router.goto("/platform");
		};
		this.cancel.addEventListener("click", this.fcancel);
		this.leave.addEventListener("click", this.fleave);

		window.onbeforeunload = function () {
			aborting(socket.ws, game);
		};
	}
	
	disconnectedCallback()
	{
		this.cancel.removeEventListener("click", this.fcancel);
		this.leave.removeEventListener("click", this.fleave);
		window.onpopstate = null;
		window.onbeforeunload = null;
	}
	
  render()
  {
    this.root.innerHTML = `
      <style>
        :host
        {
          display: block;
          width: 100%;
          height: 100%;
        }
        .wrapper
        {
          width: 100%;
          height: 100%;
          z-index: 1001;
          position: absolute;
          top: 0;
          left: 0;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .popup {
          width: 33%;
          background-color: var(--dark-purple);
          padding: 15px;
          border: none;
          border-radius: 10px;
          box-shadow: 5px 5px 5px #000;
          color: var(--light-olive);
        }
        .popup .text-right .btn-cancel
        {
          font-family: var(--body-font);
          background-color: var(--dark-teal);
          color: var(--light-olive);
          padding: 10px 20px;
          border-radius: 18px;
          border: none;
        }
        
        .popup .text-right .btn-primary
        {
          font-family: var(--body-font);
          background-color: var(--coral);
          color: var(--light-olive);
          padding: 10px 20px;
          border-radius: 18px;
          border: none;
        }
        .text-right
        {
          padding-top: 20px;
          display: flex;
          justify-content: end;
          gap: 15px;
        small{
          font-size: 10px;
        }
        }
      </style>
      <div class="wrapper">
        <div class="popup">
          <p>Sure wanna leave?</p>
          <div class="text-right">
            <button class="btn btn-cancel">Cancel</button>
            <button class="btn btn-primary">Ok</button>
          </div>
        </div>
      </div>
    `;
  }
}
customElements.define("confirm-msg", ConfirmMsg);