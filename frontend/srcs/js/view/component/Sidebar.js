export default class Sidebar extends HTMLElement {
	constructor() { super(); }
	
	connectedCallback()
	{
		this.setAttribute("id", "sidebar-view");
    this.render();
    this.doSomeThing();
	}
	
	render()
	{
      this.innerHTML += `
      <nav export class="nav">
         <a href="/platform" export class="nav_logo">
            <i export class="bx bx-grid-alt nav_icon"></i>
         </a>
         <div export class="nav_list">
            <a href="/setting" class="nav_link">
               <i class="bx bxs-cog nav_icon"></i>
            </a>
            <a href="/friend" class="nav_link">
               <i class='bx bx-group nav_icon'></i>
            </a>
            <a href="/history" class="nav_link">
               <i class='bx bx-history nav_icon'></i>
            </a>
            <a href="/logout" class="nav_link">
               <i class="bx bx-log-out nav_icon"></i>
            </a>
         </div>
        	<a href="/profile" class="nav_link">
        	<i export class="bx bx-user nav_icon"></i>
        	</a>
      </nav>
   `;
	}
	
	doSomeThing()
	{
		const arr = this.querySelectorAll("a");
		arr.forEach((elem) => {
			elem.addEventListener("click", (e) => {
				e.preventDefault();
				const href = e.currentTarget.getAttribute("href");
				window.router.goto(href);
			});
		});
	}
}
customElements.define("sidebar-view", Sidebar);