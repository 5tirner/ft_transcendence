import { auth } from "../../auth/Authentication.js";

export default class Setting extends HTMLElement
{
	constructor() { super(); }
	
	connectedCallback()
	{
      this.setAttribute("id", "setting-view");		
      this.render();
      this.initialize();
	}
	
	disconnectedCallback()
	{
    this.editUsernameButton.removeEventListener('click', this.editUserListner);
    this.editIamgeButton.removeEventListener('click', this.editImgListnet);
    this.checkbox.removeEventListener('change', this.listener3);
	}
	
	render()
	{
	  this.innerHTML = `
      <style>
        .profile-card {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          margin: 0;
          position: relative;
        }
        .profile-card .section {
          border-radius: 20px;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
          padding: 40px;
          width: 500px;
          text-align: center;
          background-color: var(--dark-purple);
          position: relative;
          border: 2px solid var(--light-olive);
        }
        .profile-card .img-div
        {
          border-radius: 50%;
          width: 100px;
          height: 100px;
          position: relative;
          border: 2px solid var(--light-olive);
          margin: 0 auto;
        }
        .profile-card .img-div img {
          border-radius: 50%;
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: relative;
          border: 1px solid var(--light-olive);
        }
        .profile-card .edit-image {
          position: absolute;
          top: 66px;
          right: 0;
          border: none;
          border-radius: 50%;
          border: 2px solid var(--light-olive);
          width: 30px;
          height: 30px;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          background-color: var(--dark-purple);
          color: var(--light-olive) !important;
        }
        .profile-card .fullname {
          margin: 20px 0;
          font-size: 16px;
          color: var(--light-olive);
        }
        .profile-card p {
          margin-bottom: 10px;
          color: gray;
        }
        .profile-card .info {
          display: flex;
          justify-content: space-around;
          align-items: center;
          gap: 20px;
          margin: 10px 0;
        }
        .profile-card .info div {
          text-align: left;
          padding-top: 20px;
        }
        .profile-card .info div p {
          margin: 3px 0;
          font-size: 14px;
        }
        
        .profile-card .section .edit-btn
        {
          font-size: 10px;
          text-transform: uppercase;
          border: none;
          padding: 10px 40px;
          cursor: pointer;
          display: inline-block;
          border-radius: 8px;
          background-color: var(--coral);
          color: var(--light-olive);
          box-shadow: 0 0 0 3px #2f2e41, 0 6px 0 #2f2e41;
          transition: all 0.1s ease, background 0.3s ease;
          font-family: "Press Start 2P", sans-serif !important;
        }
        .checkbox-wrapper-3 input[type="checkbox"] {
          visibility: hidden;
          display: none;
        }
      
        .checkbox-wrapper-3 .toggle {
          position: relative;
          display: block;
          width: 40px;
          height: 20px;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          transform: translate3d(0, 0, 0);
        }
        .checkbox-wrapper-3 .toggle:before {
          content: "";
          position: relative;
          top: 3px;
          left: 3px;
          width: 34px;
          height: 14px;
          display: block;
          background: #9A9999;
          border-radius: 8px;
          transition: background 0.2s ease;
        }
        .checkbox-wrapper-3 .toggle span {
          position: absolute;
          top: 0;
          left: 0;
          width: 20px;
          height: 20px;
          display: block;
          background: white;
          border-radius: 10px;
          box-shadow: 0 3px 8px rgba(154, 153, 153, 0.5);
          transition: all 0.2s ease;
        }
        .checkbox-wrapper-3 .toggle span:before {
          content: "";
          position: absolute;
          display: block;
          margin: -18px;
          width: 56px;
          height: 56px;
          background: rgba(79, 46, 220, 0.5);
          border-radius: 50%;
          transform: scale(0);
          opacity: 1;
          pointer-events: none;
        }
      
        .checkbox-wrapper-3 #cbx-3:checked + .toggle:before {
          background: var(--teal);
        }
        .checkbox-wrapper-3 #cbx-3:checked + .toggle span {
          background: var(--dark-teal);
          transform: translateX(20px);
          transition: all 0.2s cubic-bezier(0.8, 0.4, 0.3, 1.25), background 0.15s ease;
          box-shadow: 0 3px 8px rgba(79, 46, 220, 0.2);
        }
        .checkbox-wrapper-3 #cbx-3:checked + .toggle span:before {
          transform: scale(1);
          opacity: 0;
          transition: all 0.4s ease;
        }
        .tfa
        {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          padding: 20px 20px 0 20px;
          p{
            color: var(--light-olive);
            font-size: 14px;
          }
        }
      </style>
      
      <div class="profile-card">
       	<div class="section">
            <div class="img-div">
          		<img
           			src="${auth.avatar}"
           			id="profileImage"
              />
              <a href="" class="edit-image"> <i class='bx bx-pencil'></i> </a>
            </div>
        		
        		<h4 class="fullname">${auth.fullname}</h4>
        		<p  class="username" username="username">${auth.user}</p>
        		<div class="info">
       			<div>
        				<p>Name</p>
        				<p class="fullname">${auth.fullname}</p>
       			</div>
       			<button class="edit-btn">Edit</button>
        		</div>
            <div class="tfa">
              <p>Two Factor Auth</p>
              <div class="checkbox-wrapper-3">
                <input type="checkbox" id="cbx-3" ${auth.tfa ? 'checked' : ''}/>
                <label for="cbx-3" class="toggle"><span></span></label>
              </div>
            </div>
       	</div>
      </div> 
    `;
	}
	
	initialize()
	{
    this.checkbox = this.querySelector("#cbx-3");
    this.editIamgeButton = this.querySelector(".edit-image");
    this.editUsernameButton = this.querySelector(".edit-btn");
    this.target = this.querySelector('.username');
    this.editUserListner = (e) => {
      e.preventDefault();
      const elem = document.createElement('update-user');
      this.append(elem);
    }
    this.editImgListnet = (e) => {
      e.preventDefault();
      const elem = document.createElement('update-avatar');
      this.append(elem);
    }
    this.listener3 = async (e) => {
      console.log(e.target.checked);
      if ( e.target.checked == true )
      {
        const container = this.querySelector('.profile-card .section');
        const elem = document.createElement('t-f-a');
        container.parentNode.appendChild(elem);
      }
      else
      {
        // cancling the 2FA
      }
    }
    
    this.editUsernameButton.addEventListener('click', this.editUserListner);
    this.editIamgeButton.addEventListener('click', this.editImgListnet);
    this.checkbox.addEventListener('change', this.listener3);
	}
}
customElements.define("setting-view", Setting);
