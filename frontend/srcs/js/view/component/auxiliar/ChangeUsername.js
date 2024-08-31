import API from "../../../service/API.js";

export default class UserUpdate extends HTMLElement
{
	constructor() { super();}
	
	connectedCallback()
	{
    this.setAttribute("id", "update-user");
    this.target = this.parentNode.querySelector('.username');
    
    this.render();
    this.initialize();
	}
	
	disconnectedCallback()
	{
	  this.removeEventListener('click', this.listner1);
    this.form.removeEventListener('click', this.listner2);
	}
	
	render()
	{
	  this.innerHTML = `
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
          width: 40%;
          height: 40%;
          background-color: var(--dark-purple);
          border: 2px solid var(--light-olive);
          border-radius: 18px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          gap: 3rem;
          position: relative;
        }
       
        .updateUsername form input
        {
          font-family: var(--body-font);
          color: var(--light-olive);
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
      
			<div class="updateUsername">
				<form id="usernameform">
				  <div class="close-btn"></div>
					<input
						type="text"
						name="fullname"
						id="input-fullname"
						placeholder="Edit your username.."
					/>
					<button type="submit" name="Save" class="save-btn">Save</button>
				</form>
			</div>
		</div> 
    `;
	}
	
	initialize()
	{
    this.form = this.querySelector('#usernameform');
    this.listner2 = (e) => {
      e.preventDefault();
      this.changeUserName();
    }
    this.listner1 = (e) => {
        this.remove();
    }
    this.close = this.querySelector('.close-btn');
    this.close.addEventListener('click', this.listner1);
    this.form.addEventListener('submit', this.listner2);
	}
	
	async changeUserName()
	{
    const value = this.querySelector('#input-fullname').value;
    if (value.length === 0)
    {
      this.notification('Username required', 'notif-danger');
      return;
    }
    const updateUserNameResponse = await API.updateUserName(value);
    const updateUserNameJson = await updateUserNameResponse.json();
    if (updateUserNameJson.status == 200)
    {
      const getUserData = await API.getUser();
      const username = await getUserData.json();
      this.target.innerHTML = username.player.username;
      this.notification('Username updated', 'notif-success');
      this.remove();
    }
    else
    {
      this.notification('Invalid username', 'notif-danger');
    }
	}
	
	notification(msg, type)
	{
    const target = this.parentNode.querySelector(type);
    if (target)
      target.remove();
    const elem = document.createElement(type);
    elem.setAttribute('msg', msg);
    this.parentNode.appendChild(elem);
	}
}
customElements.define("update-user", UserUpdate);