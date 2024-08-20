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
      this.changeProfileImage();
      this.changeUserName();
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
        .profile-card img {
          border-radius: 50%;
          width: 100px;
          height: 100px;
          object-fit: cover;
          position: relative;
          border: 2px solid var(--light-olive);
        }
        .profile-card .edit-image {
          position: absolute;
          top: 85px;
          right: 200px;
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
        .common
        {
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
        .updateUsername form, .uploadProfileImage form
        {
          width: 500px;
          height: 350px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          gap: 1rem;
        }
       
        .updateUsername form input
        {
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
        
        .profile-card .section .edit-btn, .save-btn, #updateimage button
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
        .save-btn
        {
          background-color: var(--dark-teal) !important;
          color: var(--light-olive) !important;
        }
        .edit-btn
        {
          height: 30px;
          liene-height: 1rem;
        }
        
        #updateimage
        {
         color: var(--light-olive);
         display: flex;
         flex-direction: column;
         gap: 40px;
         font-size: 12px;
         border: 2px solid var(--light-olive);
         border-radius: 20px;
        }
        
        #updateimage input[type=file]::file-selector-button {
          margin-right: 20px;
          border: none;
          background: var(--dark-teal);
          padding: 10px 20px;
          border-radius: 10px;
          color: var(--light-olive);
          cursor: pointer;
          transition: background .2s ease-in-out;
        }
        
        #updateimage input[type=file]::file-selector-button:hover {
          background: var(--teal);
        }
        // #updateimage form button
        // {
        // color: var(--light-olive);
        // display: flex;
        // flex-direction: column;
        // gap: 40px;
        // font-size: 12px;
        // border: 2px solid var(--light-olive);
        // border-radius: 20px;
        // }
      </style>  
      <div class="profile-card">
			<div class="section">
				<img
					src="${auth.avatar || "https://i.imgur.com/8bXZb8e.png"}"
					alt="Profile Picture"
					id="profileImage"
				/>
				<input
					type="file"
					id="fileInput"
					style="display: none"
					accept="image/*"
					onchange="changeProfileImage(event)"
					class="bx bx-pencil"
				/>
				
				<a class="edit-image"> <i class='bx bx-pencil'></i> </a>
				
				<h4 class="fullname">${auth.fullname}</h4>
				<p username="username">${auth.user}</p>
				<div class="info">
					<div>
						<p>Name</p>
						<p class="fullname">${auth.fullname}</p>
					</div>
					<button class="edit-btn">Edit</button>
				</div>
			</div>
			
			<div class="uploadProfileImage common" hidden>
            <form id="updateimage">
          		<label for="file">File to upload</label>
          		<input type="file" id="file" accept="image/*">
          		<button type="submit">Upload</button>
        	   </form>
			</div>
			
			<div class="updateUsername common" hidden="">
				<form id="updateusername">
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
      this.editIamgeButton = this.querySelector(".edit-image");
   	this.editUsernameButton = this.querySelector(".edit-btn");
		
      this.changeImageDiv = this.querySelector('.uploadProfileImage');
      this.changeUsernameDiv = this.querySelector(".updateUsername");
		
      this.uploadImageForm = this.querySelector('#updateimage');
      this.uploadImageForm = this.querySelector('#updateusername');
      
      this.toggleDiv(this.editIamgeButton, this.changeImageDiv);
      this.toggleDiv(this.editUsernameButton, this.changeUsernameDiv);
	}
	
	changeProfileImage()
	{
      let form = this.querySelector('#updateimage');

      form.addEventListener('submit', this.handleSubmit);
	}
	
	changeUserName()
	{
	 
	}
	
	toggleDiv(btn, div)
	{
      btn.addEventListener("click", (e) => {
         div.removeAttribute('hidden');
         div.addEventListener("click", (e) => {
            if (e.target === div)
               div.setAttribute('hidden', '');
         });
      });
	}
	
	handleSubmit (event)
	{
	   let file = this.querySelector('#file');
		event.preventDefault();
		if (!file.value.length) return;

      API.uploadAvatar(file.files[0]);
      console.log("API IMAGE: ", file.files[0]);
		// let uri = URL.createObjectURL(file.files[0]);
		// // let img = document.createElement('img');
		// // img.src = uri;
		// // app.append(img);
		// console.log(uri);

		// // reader.onload = logFile;

		// // reader.readAsDataURL(file.files[0]);
}
}
customElements.define("setting-view", Setting);
