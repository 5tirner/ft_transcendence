export default class Sidebar extends HTMLElement {
	constructor() {
		super();
	}
	connectedCallback() {
		this.setAttribute("id", "sidebar-view");

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
                    <a href="/" class="nav_link">
                      <i class="bx bx-log-out nav_icon"></i>
                    </a>
                </div>
				<a href="/profile" class="nav_link">
					<i export class="bx bx-user nav_icon"></i>
				</a>
			</nav>
        `;
		this.doSomeThing();
	}
	doSomeThing() {
		const arr = this.querySelectorAll("a");
		arr.forEach((elem) => {
			elem.addEventListener("click", (e) => {
				e.preventDefault();
				const href = e.currentTarget.getAttribute("href");
				if (href === "/profile") {
					const component = document.querySelector("#TheStat");
					const holder = document.querySelector("#components-holder");
					if (component) component.remove();
					holder.appendChild(document.createElement("stat-ics"));
				}
				if (href === "/history") {
					const component = document.querySelector("#TheHistory");
					const holder = document.querySelector("#middle-view");
					if (component) component.remove();
					const elem = document.createElement("history-view");
					holder.appendChild(elem);
				}
				window.router.goto(href);
			});
		});
	}
}