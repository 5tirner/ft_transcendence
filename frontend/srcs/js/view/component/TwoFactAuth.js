import API from "../../service/API.js";

export default class Tfa extends HTMLElement
{
  constructor() { super(); }
  
  connectedCallback()
  {
    this.render();
    this.init();
    this.verifyTfaCode();
  }
  
  diconnectedCallback()
  {
    this.close.removeEventListener('click', this.listner1);
  }
  async render()
  {
    this.innerHTML =
    `
      <style>
        .t-f-a
        {
          width: 100%;
          height: 100%;
          background: var(--dark-purple);
          position: absolute;
          border-radius: 18px;
          top: 0;
          left: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 20px;
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
        .close-btn {
          width: 15px;
          height: 15px;
          border-radius: 50%;
          position: absolute;
          right: 10px;
          top: 10px;
          overflow: hidden;
          cursor: pointer;
          background: #FF5D5B;
          border: 2px solid #CF544D;
        }
        .close-btn:before, .close-btn:after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          border-radius: 4px;
          width: 2px;
          height: 70%;
          background: var(--light-olive);
        }
        .close-btn:before {
          transform: translate(-50%, -50%) rotate(45deg);
        }
        .close-btn:after {
          transform: translate(-50%, -50%) rotate(-45deg);
        }
      </style>
      <div class="t-f-a">
        <div class="close-btn"></div>
        <img class="qrCode">
        <input
						type="text"
						id="input-fullname"
						placeholder="2FA Code"
						minlength="6" maxlength="6"
					/>
					<button class="verify-btn">Verify and Enable</button>
      </div>
    `;
    const hold = this.querySelector('.qrCode');
    const qrCode = await API.getQRcode();
    hold.setAttribute('src', qrCode);
  }
  
  init()
  {
    this.input = this.querySelector('#input-fullname');
    this.verfyBtn = this.querySelector('.verify-btn');
    this.listener2 = (e) => {
      this.verifyTfaCode(this.input.value);
    } 
    this.listner1 = (e) => {
      this.remove();
    }
    this.close = this.querySelector('.close-btn');
    this.close.addEventListener('click', this.listner1);
    this.verfyBtn.addEventListener('click', this.listener2)
  }
  
  async verifyTfaCode(value)
  {
    const res = await API.verifyTfa(value);
    console.log("value: ", res);
  }
  
}
customElements.define('t-f-a', Tfa);