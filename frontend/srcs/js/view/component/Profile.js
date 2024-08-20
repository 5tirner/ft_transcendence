import { auth } from "../../auth/Authentication.js";

export default class Profile extends HTMLElement
{
	constructor() { super(); }
	
	connectedCallback()
	{
		this.setAttribute("id", "profile-view");
      this.render();
	}
	
	render()
	{
      this.innerHTML = `
         <style>
            .user-info {
               background-color: var(--dark-purple);
               color: var(--light-olive);
               margin: 3rem auto;
               padding: 3rem;
               border-radius: 10px;
               box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
               max-width: 800px;
               display: flex;
               align-items: center;
            }
            
            .user-info .avatar {
               border-radius: 50%;
               width: 150px;
               height: 150px;
               object-fit: cover;
               position: relative;
               border: 2px solid var(--light-olive);
            }
            
            .user-info .info {
               flex: 1;
            }
            
            .user-info p {
               font-size: 16px;
               margin: 0.5rem 0;
            }
            
            .progress-bar {
               background-color: #e0e0e0;
               border-radius: 10px;
               overflow: hidden;
               margin-top: 1rem;
               margin-bottom: 0.5rem;
               height: 25px;
            }
            
            .progress {
               background-color: #4CAF50;
               height: 100%;
               width: 0;
            }
            
            .progress-text {
               margin: 0;
               font-size: 1rem;
            }
         </style>
         <section class="user-info">
            <img src="${auth.avatar}" alt="User Avatar" class="avatar">
            <div class="info">
               <p><strong>Username:</strong> ${auth.user}</p>
               <p><strong>Fullname:</strong> ${auth.fullname}</p>
               <div class="progress-bar">
                  <div class="progress" style="width: 70%;"></div>
               </div>
               <p class="progress-text">Experience: 70%</p>
            </div>
         </section>
         <stat-ics></stat-ics>
      `;
	}
}
customElements.define("profile-view", Profile);