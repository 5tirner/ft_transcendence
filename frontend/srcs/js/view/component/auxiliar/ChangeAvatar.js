import API from "../../../service/API.js";

export default class UpdateAvatar extends HTMLElement
{
	constructor() { super(); this.root = this.attachShadow({mode: 'open'})}

	connectedCallback()
	{
    this.setAttribute("id", "update-avatar");
    this.target = this.parentNode.querySelector('#profileImage');
    this.render();
    this.initialize();
	}

	disconnectedCallback()
	{
    this.root.removeEventListener('click', this.listner1);
    this.form.removeEventListener('click', this.listner2);
	}

	render()
	{
	  this.root.innerHTML = `
      <style>
        .updateAvatar
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
        .updateAvatar form
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
          color: var(--light-olive);
        }
        .updateAvatar form input
        {
          font-family: var(--body-font);
          color: var(--light-olive);
        }
        .updateAvatar form input[type=file]::file-selector-button {
          margin-right: 20px;
          border: none;
          background: var(--dark-teal);
          padding: 10px 20px;
          border-radius: 10px;
          color: var(--light-olive);
          cursor: pointer;
          transition: background .2s ease-in-out;
          font-family: var(--body-font);
          color: var(--light-olive);
          box-shadow: 0 0 0 3px #2f2e41, 0 6px 0 #2f2e41;
        }

        .updateAvatar form input[type=file]::file-selector-button:hover {
          background: var(--coral);
        }

        .updateAvatar form button
        {
          background-color: var(--dg) !important;
          color: var(--light-olive) !important;
          font-size: 10px;
          text-transform: uppercase;
          border: none;
          padding: 10px 40px;
          cursor: pointer;
          display: block;
          border-radius: 8px;
          box-shadow: 0 0 0 3px #2f2e41, 0 6px 0 #2f2e41;
          transition: all 0.1s ease, background 0.3s ease;
          font-family: var(--body-font);
        }
        
        .close-btn {
          width: 15px;
          height: 15px;
          border-radius: 50%;
          position: absolute;
          right: 12px;
          top: 12px;
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

      <div class="updateAvatar">
        <form id="avatarform">
          <div class="close-btn"></div>
      		<label for="file">File to upload</label>
      		<input type="file" id="file" accept="image/*">
      		<button type="submit">Upload</button>
    	   </form>
			</div>
    `;
	}
	
	initialize()
	{
    this.form = this.root.querySelector('#avatarform');
		this.close = this.root.querySelector('.close-btn');
		this.listner1 = (e) => {
        this.remove();
    }
    this.listner2 = (e) => {
      e.preventDefault();
      this.changeAvatar();
    }
    this.close.addEventListener('click', this.listner1);
    this.form.addEventListener('submit', this.listner2);
	}
	
	async changeAvatar()
	{
    const value = this.root.querySelector('#file').value;
    const updateAvatarResponse = await API.updateAvatar(value);
    const updateAvatarJson = await updateAvatarResponse.json();
    if (updateAvatarJson.status == 200)
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
	}
}
customElements.define("update-avatar", UpdateAvatar);