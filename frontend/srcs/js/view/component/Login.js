export default class Login extends HTMLElement {
	constructor() {
		super();
		this.root = this.attachShadow({ mode: "open" });
	}
	connectedCallback() {
		this.setAttribute("id", "login-view");
		this.setAttribute("hidden", "");
		this.root.innerHTML += `
    <style>
      a {
        text-decoration: none;
      }
      .bluer {
        width: 100% !important;
        height: 100% !important;
        filter: blur(5px);
        backdrop-filter: blur(5px);
        position: absolute;
        left: 0;
        top: 0;
        z-index: 9;
      }
      .login-form {
        width: 35%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 15px;
        z-index: 99;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        transition: ease-in;
        transition-delay: 5s;
        padding-top: 20px;
        padding-bottom: 40px;
        box-shadow: rgba(68, 68, 68, 0.1) 0px 4px 16px, rgba(68, 68, 68, 0.1) 0px 8px 24px, rgba(68, 68, 68, 0.1) 0px 16px 56px;
      }
      
      .sub-login-form {
        width: 75%;
        height: 100%;
        text-align: center;
      }
      
      .logo {
        color: var(--light-olive);
        font-weight: 400;
        padding-top: 10px;
        padding-bottom: 20px;
      }
      
      .google-btn {
        padding-top: 10px;
        padding-bottom: 10px;
        display: flex;
        justify-content: center;
        color: var(--peach);
      }
      
      a .intra-42
      {
        background: rgb(190, 60, 237) !important;
        background: linear-gradient(
          90deg,
          rgba(190, 60, 237, 1) 43%,
          rgb(158, 165, 179) 100%
        ) !important;
        border: none !important;
      }
      .intra-btn {
        padding-top: 10px;
        padding-bottom: 10px;
        display: flex;
        justify-content: center;
      }
      /* --------------- Google + Intra buttons -------------- */
      .button-23 {
        font-size: 80%;
        font-weight: 300;
        text-transform: uppercase;
        letter-spacing: 1px;
        border: none;
        cursor: pointer;
        display: inline-block;
        padding: 2.5% 6%;
        border-radius: 8px;
        background-color: var(--dark-teal);
        color: var(--light-olive);
        box-shadow: 0 0 0 3px #2f2e41, 0 6px 0 #2f2e41;
        transition: all 0.1s ease, background 0.3s ease;
        font-family: "Press Start 2P", sans-serif !important;
      }
      .button-23:focus-visible {
        box-shadow: #222222 0 0 0 2px, rgba(255, 255, 255, 0.8) 0 0 0 4px;
        transition: box-shadow 0.2s;
        outline: none;
        border-color: inherit;
        -webkit-box-shadow: none;
        box-shadow: none;
      }
      .button-23:active {
        transform: scale(0.96);
        outline: none;
      }
      .button-23 span {
        font-size: 14px;
      }
    </style>
    <filter class="bluer"></filter>
    <div class="login-form">
			<div class="sub-login-form">
				<div class="logo">Pong.me</div>
				<div class="google-intra-login">
					<a href="/platform" class="google-btn" name="google">
						<button
							type="button"
							role="button"
							class="button-23"
							
						>
							<span class="G">G </span>Login with google<span>
								>
							</span>
						</button>
					</a>
					<a href="/platform" class="intra-btn" name="intra">
						<button
							type="button"
							role="button"
							class="button-23 intra-42"
							
						>
							<span class="42">42 </span>Login with Intra<span>
								>
							</span>
						</button>
					</a>
				</div>
			</div>
		</div>
    `;
		this.root.querySelector(".bluer").addEventListener("click", () => {
			this.setAttribute("hidden", "");
		});
		const links = this.root.querySelectorAll("a");
		links.forEach((link) => {
			link.addEventListener("click", (e) => {
				e.preventDefault();
        if (link.getAttribute('name') === 'google')
          window.Auth.loginGoogle();
        else
          window.Auth.loginIntra();
			});
		});
	}
	// onclick="window.Auth.loginIntra()"
	// onclick="window.Auth.loginGoogle()"
}

customElements.define("login-view", Login);