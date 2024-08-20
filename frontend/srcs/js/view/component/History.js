import { auth } from "../../auth/Authentication.js";

export default class History extends HTMLElement
{
	constructor()
	{
		super();
		this.root = this.attachShadow({ mode: "open" });
	}
	
	async connectedCallback()
	{
		this.setAttribute("id", "TheHistory");
		
		const ticData = await auth.getTicHisto();
		const pongData = await auth.getPongHisto();
		
    this.render();
    
		const tttInjectHere = this.root.querySelector(".tttInjectHere");
		const pongInjectHere = this.root.querySelector(".pongInjectHere");
		
		const createHistoElem = (data) => {
			const parsed = JSON.parse(data);
			let elem = "";
			if (Object.keys(parsed).length == 0) {
				elem = `
          <tr>
            <td colspan="5" style="text-align:center; color: var(--light-olive); padding: 20px; border-radius: 8px;">
              No Matches Played Yet!
            </td>
          </tr>
        `;
			} else {
				let result = "";
				let what = "";
				for (const [key, value] of Object.entries(parsed)) {
					console.log("key: ", key);
					console.log("value: ", value);

					if (value.winner === value.oppenent) result = "lose";
					else result = "win";
					elem += `
          <tr>
            <td class="opponent">
              <img src="${value.pic || "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"}" alt="avatar">
               ${value.oppenent}
            </td>
            <td class="${result}">
              ${result}
            </td>
          </tr>`;
				}
			}
			return elem;
		};
		tttInjectHere.innerHTML = createHistoElem(ticData);
		pongInjectHere.innerHTML = createHistoElem(pongData);
	}
	
	render()
	{
    this.root.innerHTML = `
      <style>
        .wrapper
        {
          display: flex;
          gap: 50px;
          width: 90%;
        }
        .container {
            background: var(--dark-purple);
            color: var(--light-olive);
            padding: 20px 20px;
            border-radius: 24px;
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
            width: 90%;
            max-width: 1000px;
            text-align: left;
            position: relative;
            height: fit-content;
            overflow-y: scroll;
        }
        .container::-webkit-scrollbar {
            display: none;
        }
        
        h1 {
            color: var(--light-olive);
            margin-bottom: 20px;
            font-size: 24px;
            font-weight: 500;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        
        th, td {
            padding: 15px 20px;
            text-align: left;
            font-size: 14px;
            color: #666;
        }
        
        th {
            background: var(--dark-purple);
            color: var(--light-olive);
            border-bottom: 2px solid #eee;
        }
        
        tbody tr {
            background: var(--dark-purple);
            color: var(--light-olive);
            transition: background-color 0.3s;
        }
        
        tbody tr td
        {
          color: var(--light-olive);
        }
        
        .highlight {
            background-color: #f0f8ff;
            font-weight: bold;
            border-radius: 8px;
            position: relative;
        }

        .opponent {
            display: flex;
            gap: 10px;
            align-items: center;
        }
        
        .opponent img {
            border-radius: 50%;
            width: 40px;
            height: 40px;
            object-fit: cover;
            position: relative;
            border: 2px solid var(--light-olive);
        }
        .win
        {
          color: var(--teal);
        }
        .lose
        {
          color: var(--coral);
        }
      </style>
      <div class="wrapper">
        <div class="container">
          <h1>Tic-Tac-Toe History</h1>
          <table>
              <thead>
                  <tr>
                      <th>Opponent</th>
                      <th>Result</th>
                      <th>Score</th>
                  </tr>
              </thead>
              <tbody class="tttInjectHere">
              </tbody>
          </table>
        </div>
        
        <div class="container">
          <h1>Pong Match History</h1>
          <table>
              <thead>
                  <tr>
                      <th>Opponent</th>
                      <th>Result</th>
                      <th>Score</th>
                  </tr>
              </thead>
              <tbody class="pongInjectHere">
              </tbody>
          </table>
        </div>
      </div>
    `;
	}
}
customElements.define("history-view", History);