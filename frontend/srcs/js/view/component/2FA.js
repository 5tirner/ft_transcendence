import API from "../../service/API.js";
import { danger } from "./assets/import.js";
import { info } from "./assets/import.js";
import { success } from "./assets/import.js";

export default class tfaView extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		this.render();
		this.init();
	}

	diconnectedCallback() {}

	async render() {
		this.innerHTML = `
      <style>
        .t-f-a
        {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          justify-content: center;
          align-items: center;
          backdrop-filter: blur(15px);
        }
        .t-f-a .wrapper
        {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          border: 2px solid var(--light-olive);
          width: 50%;
          height: 50%;
          gap: 20px;
          border-radius: 18px;
          
        }
        .t-f-a img
        {
          width: 250px;
          height: 250px;
        }
        .t-f-a input
        {
          font-family: var(--body-font);
          color: var(--light-olive);
          border: 2px solid var(--light-olive);
          border-radius: 10px;
          padding: 15px 10px;
          background: transparent;
          width: 50%;
          font-size: 10px;
          letter-spacing: 4px;
          text-align: center;
        }
        .t-f-a input::placeholder
        {
          color: var(--light-olive);
          font-size: 10px;
          text-align: center;
          letter-spacing: 2px;
        }
        .t-f-a input:active {
          outline: none;
        }
        
        .t-f-a input:focus {
          outline: none;
          border: 2px solid var(--dark-teal);
        }
        .verify-btn
        {
          background-color: var(--dark-teal) !important;
          color: var(--light-olive) !important;
          font-size: 10px;
          text-transform: uppercase;
          border: none;
          padding: 10px 40px;
          cursor: pointer;
          display: inline-block;
          border-radius: 8px;
          box-shadow: 0 0 0 3px #2f2e41, 0 6px 0 #2f2e41;
          transition: all 0.1s ease, background 0.3s ease;
          font-family: "Press Start 2P", sans-serif !important;
        }
      </style>
      <div class="t-f-a">
          <div class="wrapper">
              <input type="text"
						id="input-fullname"
						placeholder="2FA Code"
						minlength="6" maxlength="6"
					/>
					<button class="verify-btn">Verify</button>
        </div>
      </div>
    `;
	}

	init() {
		this.input = this.querySelector("#input-fullname");
		this.verfyBtn = this.querySelector(".verify-btn");
		this.listener2 = (e) => {
			if (this.input.value.length < 6) {
				if (this.input.value.length == 0)
					this.notification(info, "2FA code required");
				else this.notification(info, "2FA code is short");
				return;
			}
			this.verifyTfaCode(this.input.value);
		};

		this.verfyBtn.addEventListener("click", this.listener2);
		this.addEventListener("keydown", (e) => {
			if (e.key === "Enter") {
				this.listener2();
			}
		});
	}

	async verifyTfaCode(value) {
		const res = await API.postLoginTfaVerify(value);
		const data = await res.json();
		console.log(data);
		if (data.statusCode == 200) {
			this.notification(success, "2FA is enabled");
			this.remove();
			router.redirecto("/platform");
		} else {
			this.input.value = "";
			this.notification(danger, "Invalid 2FA code");
		}
	}

	notification(type, msg) {
		type.msg = msg;
		const target = this.parentNode.querySelector(type.localName);
		if (target) target.remove();
		this.parentNode.appendChild(type);
	}
}
customElements.define("tfa-view", tfaView);
