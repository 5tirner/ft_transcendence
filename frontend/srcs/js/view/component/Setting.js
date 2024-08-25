import { auth } from "../../auth/Authentication.js";
import API from "../../service/API.js"
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
          padding: 20px;
          width: 500px;
          height: 350px;
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
       	</div>
      </div> 
    `;
	}
	
	initialize()
	{
    this.editIamgeButton = this.querySelector(".edit-image");
    this.editUsernameButton = this.querySelector(".edit-btn");
    this.target = this.querySelector('.username');
    const editUserListner = (e) => {
      e.preventDefault();
      const elem = document.createElement('update-user');
      this.append(elem);
    }
    const editImgListnet = (e) => {
      e.preventDefault();
      const elem = document.createElement('update-avatar');
      this.append(elem);
    }
    this.editUsernameButton.addEventListener('click', editUserListner);
    this.editIamgeButton.addEventListener('click', editImgListnet);
	}
}
customElements.define("setting-view", Setting);
