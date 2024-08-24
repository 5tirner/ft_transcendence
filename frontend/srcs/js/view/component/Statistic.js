import { auth } from "../../auth/Authentication.js";

export default class Statistic extends HTMLElement
{
	constructor()
	{
		super();
		this.root = this.attachShadow({ mode: "open" });
	}
	async connectedCallback()
	{
		this.setAttribute("id", "TheStat");
		this.setAttribute("game", "Tic-Tac-Toe");
		const ticData = await auth.getTicStat();
		const pigData = await auth.getPongStat();
		this.root.innerHTML = `
      <style>
        .stats {
          background-color: var(--dark-purple);
          color: var(--light-olive);
          margin: 2rem auto;
          padding: 1rem;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          max-width: 600px;
          padding: 50px 80px;
        }
        
        .user-info h2, .stats h2 {
            margin-top: 0;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
        }
        
        th, td {
            padding: 0.5rem;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        
        th {
            // background-color: #f2f2f2;
        }
        
        tr:hover {
            background-color: #f1f1f1;
            color: var(--dark-purple)
        }
        .flexing
        {
          width: 100%;
          display: flex;
          flex-direction: row;
        }
      </style>
      <div class="flexing">
        <section class="stats">
            <h4>Pong Stats</h4>
            <table>
                <thead>
                    <tr>
                        <th>Stat</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Games Played</td>
                        <td>${pigData.gamesPlayed}</td>
                    </tr>
                    <tr>
                        <td>Wins</td>
                        <td>${pigData.wins}</td>
                    </tr>
                    <tr>
                        <td>Losses</td>
                        <td>${pigData.loses}</td>
                    </tr>
                    <tr>
                        <td>Draw</td>
                        <td>${pigData.draws}</td>
                    </tr>
                    <tr>
                        <td>Total Points</td>
                        <td>13200</td>
                    </tr>
                </tbody>
            </table>
        </section>
        <section class="stats">
            <h4>Tic-Tac-Toe Stats</h4>
            <table>
                <thead>
                    <tr>
                        <th>Stat</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Games Played</td>
                        <td>${ticData.gamesPlayed}</td>
                    </tr>
                    <tr>
                        <td>Wins</td>
                        <td>${ticData.wins}</td>
                    </tr>
                    <tr>
                        <td>Losses</td>
                        <td>${ticData.loses}</td>
                    </tr>
                    <tr>
                        <td>Draw</td>
                        <td>${ticData.draws}</td>
                    </tr>
                    <tr>
                        <td>Total Points</td>
                        <td>13200</td>
                    </tr>
                </tbody>
            </table>
        </section>
      </div>
    `;
	}
}
customElements.define("stat-ics", Statistic);