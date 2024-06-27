import API from "./API.js";
// import Router from "./Router.js";

const Auth = {
	user: null,

	logout: async () => {
		const response = await API.logout();

		document.querySelector("#chat").style.display = "none";
		// Router.go("/login");
	},
	loginIntra: async (event) => {
		window.location.href = "http://127.0.0.1:8000/api/oauth/intra/";
	},
	isAuth: async (event) => {
		const response = await API.isLogedIn();
		if (response.ok) {
			const res = await response.json();
			const { isLoged } = res;
			console.log(res);
			Auth.user = res.data.username;
			return isLoged;
		}
		return false;
	},
	init: () => {}
};

export default Auth;

// make it a global object
window.Auth = Auth;
