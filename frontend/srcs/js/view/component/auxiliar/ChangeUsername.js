import API from "../../../service/API.js"

export default class UserUpdate extends HTMLElement
{
	constructor() { super(); this.root = this.attachShadow({ mode: "open" });}
	
	connectedCallback()
	{
    this.setAttribute("id", "update-user");
    this.target = this.parentNode.querySelector('.username');
    console.log("The object Target: ", this.target);
    
    this.render();
    this.initialize();
    this.changeUserName();
	}
	
	disconnectedCallback()
	{
	}
	
	render()
	{
	  this.root.innerHTML = `
      <style>
        .updateUsername
        {
          font-family: var(--body-font);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 102;
          justify-content: center;
          text-align: center;
          align-items: center;
          backdrop-filter: blur(10px);
          display: flex;
        }
        .updateUsername form
        {
          width: 500px;
          height: 350px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          gap: 1rem;
          position: relative;
        }
       
        .updateUsername form input
        {
          font-family: var(--body-font);
          color: white;
          border: 2px solid var(--light-olive);
          border-radius: 10px;
          padding: 15px 10px;
          background: transparent;
          width: 80%;
          font-size: 10px;
        }
        .updateUsername form input::placeholder
        {
          color: var(--light-olive);
          font-size: 10px;
        }
        .updateUsername form input:active {
          outline: none;
        }
        
        .updateUsername form input:focus {
          outline: none;
        }
        .save-btn
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
      
			<div class="updateUsername">
				<form id="usernameform">
					<input
						type="text"
						name="fullname"
						id="input-fullname"
						placeholder="Edit your name.."
						required
					/>
					<button type="submit" name="Save" class="save-btn">Save</button>
				</form>
			</div>
		</div> 
    `;
	}
	
	initialize()
	{
	  this.container = this.root.querySelector('.updateUsername');
    this.form = this.root.querySelector('#usernameform');
    this.root.addEventListener('click', (e) => {
      if (e.target === this.container)
        this.remove();
    });
    
    this.form.addEventListener('submit', (e) =>{
      e.preventDefault();
    })
	}
	
	changeUserName()
	{
    this.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const value = this.root.querySelector('#input-fullname').value;
    const updateUserNameResponse = await API.updateUserName(value);
    const updateUserNameJson = await updateUserNameResponse.json();
    if (updateUserNameJson.status == 200)
    {
      const getUserData = await API.getUser();
      const username = await getUserData.json();
      this.target.innerHTML = username.player.username;
      this.remove();
      console.log("user updated successfuly");
    }
    else
    {
      const errorElem = document.createElement('div');
      errorElem.setAttribute('style', 'position: absolute; top:50px;');
      errorElem.innerHTML = `
        <style>
          p
          {
            color: var(--light-olive);
          }
        </style>
        <p> invalid username </p>
      `
      this.form.insertBefore(errorElem, this.form.firstChild);
      console.log("invalid username");
    }
    });
	}
}
customElements.define("update-user", UserUpdate);