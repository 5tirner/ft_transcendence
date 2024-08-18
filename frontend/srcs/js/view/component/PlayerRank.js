export default class RankPlayers extends HTMLElement {
	constructor() {
		super();
		this.root = this.attachShadow({ mode: "open" });
	}
	connectedCallback() {
		this.root.innerHTML = `
      <style>
        .avatar {
            width: 110px;
            height: 110px;
        }
        .avatar img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
        }
        
        .name {
            width: 100%;
            text-align: center;
            color: var(--light-olive);
            font-size: 12px;
            padding: 10px 0;
        
        }
        .points {
            margin-top: 5px;
            color: var(--dark-purple);
            width: 100%;
            height: 20%;
            text-align: center;
            font-size: 10px;
        }
        .rank-card
        {
            margin-top: 20px;
            min-width: 180px;
            max-width: 180px;
            border-radius: 12px;
            background-color: var(--teal);
            height: 50%;
            padding: 15px 10px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            max-height: 100%;
        }
      </style>
      <div class="rank-card">
          <div class="avatar">
              <img src="${auth.avatar}" alt="avatar">
          </div>
          <div class="name">${auth.fullname}</div>
          <div class="points">${auth.wins} wins</div>
      </div>
    `;
	}
}