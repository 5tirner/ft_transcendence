export default class Setting extends HTMLElement
{
	constructor() { super(); this.root = this.attachShadow({mode: 'closed'})}
	
	connectedCallback()
	{
    this.setAttribute("id", "update-avatar");		
    this.render();
	}
	
	disconnectedCallback()
	{
	}
	
	render()
	{
	  this.innerHTML = `
      <style>
        .updateAvatar
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
        .updateAvatar form
        {
         color: var(--light-olive);
         display: flex;
         flex-direction: column;
         gap: 40px;
         font-size: 12px;
         border: 2px solid var(--light-olive);
         border-radius: 20px;
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
        }
        
        .updateAvatar form input[type=file]::file-selector-button:hover {
          background: var(--teal);
        }
        
        .updateAvatar form button
        {
        color: var(--light-olive);
        display: flex;
        flex-direction: column;
        gap: 40px;
        font-size: 12px;
        border: 2px solid var(--light-olive);
        border-radius: 20px;
        }
      </style>  
      
      <div class="updateAvatar" hidden>
        <form id="avatarform">
      		<label for="file">File to upload</label>
      		<input type="file" id="file" accept="image/*">
      		<button type="submit">Upload</button>
    	   </form>
			</div>
    `;
	}
}