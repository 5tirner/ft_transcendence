import API from "../service/API.js";
// import { render_chat } from "../view/chat/chat.js";

export const auth = {
	user: null,
	avatar: null,

	logout: async () => {
		await API.logout();
	},
	loginIntra: () => {
		window.location.href = "https://127.0.0.1/api/oauth/intra/";
	},
	loginGoogle: () => {
		window.location.href = "http://127.0.0.1:8000/api/google/";
	},
	isAuth: async () => {
		const response = await API.isLogedIn();
		if (response && response.ok) {
			const res = await response.json();
			const { isLoged } = res;
			auth.user = res.data.username;
			auth.avatar = res.data.avatar;
			auth.loses = res.data.losses;
			auth.wins = res.data.wins;
			auth.fullname = `${res.data.first_name} ${res.data.last_name}`;
			// render_chat();
			return isLoged;
		}
		return false;
	},
	getTicStat: async () => {
		const object = await API.getTicTacToeStat();
		return object.json();
	},
	getTicHisto: async () => {
		const object = await API.getTicTacToeHistory();
		return object.json();
	},
	getPongStat: async () => {
		const object = await API.getPigPagPogStat();
		return object.json();
	},
	getPongHisto: async () => {
		const object = await API.getPigPagPogHistory();
		return object.json();
	}
};
window.Auth = auth;
