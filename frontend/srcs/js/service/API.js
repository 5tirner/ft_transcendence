function getCookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(";");
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == " ") {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

const API = {
	authEndpoint: "https://127.0.0.1:8000/api/",
	chatEndpoint: "https://127.0.0.1:8000/api/chat/",
	friendshipEndpoint: "https://127.0.0.1:8000/api/friendship/",
	tttStatEndpoint: "https://127.0.0.1:8000/TicTacToe/myProfile/",
	tttHistoEndpoint: "https://127.0.0.1:8000/TicTacToe/History",
	pongStatEndpoint: "https://127.0.0.1:8000/PongPong/myProfile",
	pongHistoEndpoint: "https://127.0.0.1:8000/PongPong/History",
	playersEndpoint: "https://127.0.0.1:8000/api/players/",
	TwoFactAuth: "https://127.0.0.1:8000/api/TFA/codeqr/",

	// ADD HERE ALL THE OTHER API FUNCTIONS
	commonPostFunc: async (endPoint, userData) => {
		try {
			const res = await API.makePostRequest(endPoint, userData);
			return res;
		} catch (err) {
			console.log("Error: ", err);
			return null;
		}
	},

	commonGetFunc: async (endPoint) => {
		try {
			const res = await API.makeGetRequest(endPoint);
			return res;
		} catch (err) {
			console.log("Error: ", err);
			return null;
		}
	},

	// Function Make a POST request
	login: (userData) => {
		return API.commonPostFunc(`${API.authEndpoint}logins/`, userData);
	},

	register: (userData) => {
		return API.commonPostFunc(`${API.authEndpoint}signups/`, userData);
	},

	createChatRoom: (user_id) => {
		return API.commonPostFunc(`${API.chatEndpoint}create/`, {
			user_id: user_id
		});
	},

	// Function Make a GET request
	isLogedIn: () => {
		return API.commonGetFunc(`${API.authEndpoint}usercheck/`);
	},

	logout: () => {
		return API.commonGetFunc(`${API.authEndpoint}logouts/`);
	},

	getUser: () => {
		return API.makeGetRequest(`${API.authEndpoint}`);
	},
	getUserProfile: ({ username }) => {
		return API.commonGetFunc(`${API.authEndpoint}?username=${username}`);
	},

	getFriends: () => {
		return API.commonGetFunc(`${API.friendshipEndpoint}?type=friends`);
	},

	getFriendRequest: () => {
		return API.commonGetFunc(`${API.friendshipEndpoint}?type=invites`);
	},

	getSentRequests: () => {
		return API.commonGetFunc(`${API.friendshipEndpoint}?type=requests`);
	},

	getBlockedUsers: () => {
		return API.commonGetFunc(`${API.friendshipEndpoint}?type=blocks`);
	},

	sendAndAcceptFriendRequest: (user_id) => {
		return API.commonPostFunc(API.friendshipEndpoint, {
			id_target: user_id
		});
	},

	removeFriend: (user_id) => {
		return API.makeDeleteRequest(API.friendshipEndpoint, {
			id_target: user_id
		});
	},

	removeBlock: (user_id) => {
		return API.makeDeleteRequest(API.playersEndpoint + "block/", {
			id_target: user_id
		});
	},

	blockUser: (user_id) => {
		return API.commonPostFunc(API.playersEndpoint + "block/", {
			id_target: user_id
		});
	},

	getConversatons: () => {
		return API.commonGetFunc(API.chatEndpoint);
	},

	getConvMessages: (room_id) => {
		return API.commonGetFunc(`${API.chatEndpoint}${room_id}`);
	},
	getTicTacToeStat: () => {
		return API.commonGetFunc(`${API.tttStatEndpoint}`);
	},
	getTicTacToeHistory: () => {
		return API.commonGetFunc(`${API.tttHistoEndpoint}`);
	},
	getPigPagPogStat: () => {
		return API.commonGetFunc(`${API.pongStatEndpoint}`);
	},
	getPigPagPogHistory: () => {
		return API.commonGetFunc(`${API.pongHistoEndpoint}`);
	},
	markMessagesAsRead: (room_id) => {
		API.commonGetFunc(`${API.chatEndpoint}read/${room_id}/`);
	},

	getPlayers: () => {
		return API.commonGetFunc(API.playersEndpoint);
	},

	makePostRequest: async (url, data) => {
		const headers = {
			"Content-Type": "application/json"
		};
		const response = await fetch(url, {
			method: "POST",
			headers,
			body: JSON.stringify(data)
		});
		return response;
	},
	makeDeleteRequest: async (url, data) => {
		const headers = {
			"Content-Type": "application/json"
		};
		const response = await fetch(url, {
			method: "DELETE",
			headers,
			body: JSON.stringify(data)
		});
		return response;
	},
	makeGetRequest: async (url) => {
		const headers = {
			"Content-Type": "application/json"
		};
		const opts = {
			method: "GET",
			mode: "same-origin",
			headers,
			credentials: "include"
		};
		try {
			const res = await fetch(url, opts);
			// !GET https://127.0.0.1:8000/PongPong/History/ 500 (Internal Server Error)
			return res;
		} catch (e) {
			console.log(e);
		}
		return null;
	},

	updateUserName: async (username) => {
		return API.makePostRequest(API.authEndpoint, { player: { username } });
	},

	uploadAvatar: async (image) => {
		const formData = new FormData();
		formData.append("avatar", image);
		const header = {
			"Content-Type": "multipart/form-data"
		};
		const opts = {
			method: "POST",
			header,
			body: formData
		};
		return fetch(API.authEndpoint + "avatar/", opts);
	},

	getQRcode: async () => {
		const qr = await API.makeGetRequest(`${API.TwoFactAuth}`);
		const blob = await qr.blob();
		return URL.createObjectURL(blob);
	},
	verifyTfa: async (code) => {
		return await API.makePostRequest(`${API.authEndpoint}TFA/verify/`, {
			code
		});
	},
	postLoginTfaVerify: async (code) => {
		const auth_token = getCookie("auth_token");
		const headers = {
			"Content-Type": "application/json",
			Authorization: `Token ${auth_token}`
		};
		const opts = {
			method: "POST",
			headers,
			body: JSON.stringify({ code })
		};
		return fetch(`${API.authEndpoint}TFA/postlogin/`, opts);
	},
	disableTfa: async () => {
		return await API.makePostRequest(API.authEndpoint, {
			player: { two_factor: false }
		});
	}
};

export default API;
