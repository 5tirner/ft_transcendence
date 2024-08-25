export default class Danger extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback()
  {
    this.msg = this.getAttribute('msg');
    this.render();
    this.timer();
  }
  
  render()
  {
    this.innerHTML =
    `
      <style>
        .error {
          border-radius: 5px;
          height: 50px;
          text-align: left;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          background-color: var(--dark-purple);
          border: 2px solid red;
          cursor:pointer;
          color: red;
          margin: 20px;
          position: absolute;
          top: 0;
          right: 15.5%;
          z-index: 999;
        }
        .error:hover{
          background-color: rgba(147, 209, 117, 0.50);
          transition:0.5s;
        }
        .error i 
        {
          color: red !important;
        }
        .error span
        {
          font-size: 14px;
          padding-left: 10px;
        }
      </style>
      <div class="error">
        <i class='bx bx-error nav_icon'></i>
        <span>${this.msg}</span>
      </div>
    `;
  }
  
  timer()
  {
    setTimeout(() => this.remove(), 3000);
  }
}
customElements.define('notif-danger', Danger);