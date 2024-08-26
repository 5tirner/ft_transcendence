export default class Danger extends HTMLElement {
  msg;
  icon;
  color;
  constructor(msg, icon, color) {
    super();
    this.msg = msg;
    this.icon = icon;
    this.color = color;
  }
  connectedCallback()
  {
    this.render();
    this.timer();
  }
  
  render()
  {
    this.innerHTML =
    `
      <style>
        .notification {
          border-radius: 5px;
          height: 50px;
          text-align: left;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          background-color: ${this.color};
          border: 2px solid ${this.color};
          cursor:pointer;
          color: var(--light-olive);
          margin: 20px;
          position: absolute;
          top: 0;
          right: 0;
          z-index: 999;
        }
        .notification:hover{
          background-color: rgba(147, 209, 117, 0.50);
          transition:0.5s;
        }
        .notification i 
        {
          color: var(--ligh-olive) !important;
          font-size: 32px;
        }
        .notification span
        {
          font-size: 14px;
          padding-left: 10px;
        }
      </style>
      <div class="notification">
        <i class='bx ${this.icon} nav_icon'></i>
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