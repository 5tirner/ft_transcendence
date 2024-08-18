import { auth } from "../../auth/Authentication.js";

export default class Setting extends HTMLElement {
	constructor() {
		super();
		// this.root = this.attachShadow({ mode: "open" });
	}
	connectedCallback() {
		this.setAttribute("id", "setting-view");
		this.setAttribute("hidden", "");
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
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          padding: 20px;
          width: 500px;
          height: 350px;
          text-align: center;
          background-color: var(--teal);
          position: relative;
        }
        #float form {
          width: 500px;
          height: 350px;
          
        }
        .profile-card img {
          border-radius: 50%;
          width: 100px;
          height: 100px;
          object-fit: cover;
          position: relative;
        }
        .profile-card .edit-image {
          position: absolute;
          top: 85px;
          right: 200px;
          border: none;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          background-color: var(--peach);
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
        .profile-card .badge {
          display: inline-block;
          padding: 5px 10px;
          background: #d4f4d2;
          color: #34a853;
          border-radius: 12px;
          font-size: 12px;
          margin-bottom: 10px;
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
        .blur
        {
          -webkit-filter: blur(10px); 
          -moz-filter: blur(10px);
          -o-filter: blur(10px);
          -ms-filter: blur(10px); 
        }
        #float
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
        }
        #float form
        {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          gap: 1rem;
          background: transparent;
        }
        #float form input
        {
          color: white;
          border: 2px solid var(--peach);
          border-radius: 10px;
          padding: 10px;
          background: transparent;
          width: 80%;
        }
        #float form input::placeholder
        {
          color: var(--light-olive);
        }
        .input:active {
          border: none;
          outline: none;
        }
        
        .profile-card .section .edit-btn, .save-btn
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
        }
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
					<div class="badge">LVL 8</div>
					<div class="info">
						<div>
							<p>Name</p>
							<p class="fullname">${auth.fullname}</p>
						</div>
						<button class="edit-btn">Edit</button>
					</div>
				</div>
				<div id="float" style="display: none">
					<form action="" method="post" name="special-name">
						<input
							type="text"
							name="fullname"
							id="input-fullname"
							placeholder="Edit your name.."
							required
						/>
						<button name="Save" class="save-btn">Save</button>
					</form>
				</div>
			</div> 
    `;
		this.render();
	}
	render() {
		const float = this.querySelector("#float");
		const editBtn = this.querySelector(".edit-btn");
		const profileCard = this.querySelector(".profile-card .section");
		const input = this.querySelector("#input-fullname");
		const editImg = this.querySelector(".edit-image");

		editBtn.addEventListener("click", (e) => {
			profileCard.classList.add("blur");
			float.setAttribute("style", "display: flex");
			float.addEventListener("click", (e) => {
				e.preventDefault();
				if (e.target.getAttribute("name") === "Save") {
					if (input.value.length == 0) {
						// console.log("Please enter some shit");
					} else {
						float.setAttribute("style", "display: none");
						profileCard.classList.remove("blur");
					}
					// post data to the backend for changing the user fullname
				}
				// console.log("target: ", e.target)
				// console.log("current target: ", e.currentTarget)
				if (e.target === float) {
					float.setAttribute("style", "display: none");
					profileCard.classList.remove("blur");
				}
			});
		});
		// editImg.addEventListener('click', listener);
		// const listener = () => {

		// }
	}
}