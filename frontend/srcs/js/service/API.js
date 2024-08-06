const API = {
	authEndpoint: "http://127.0.0.1:8000/api/",
	chatEndpoint: "http://127.0.0.1:8000/api/chat/",
	friendshipEndpoint: "http://127.0.0.1:8000/api/friendship",
	tictactoeEndpoint: "http://127.0.0.1:8000/TicTacToe/myProfile/",
	tictactoeAuthGame: "http://127.0.0.1:8000/TicTacToe/Game/",

	// ADD HERE ALL THE OTHER API FUNCTIONS
	commonPostFunc: async (endPoint, userData ) => {
		try
		{
			const res = await API.makePostRequest( endPoint, userData );
			return res;
		}
		catch ( err )
		{
			console.log("Error: ", err);
			return null;
		}
	},

	commonGetFunc: async ( endPoint ) => {
		try
		{
			const res = await API.makeGetRequest( endPoint );
			return res;
		}
		catch ( err )
		{
			console.log("Error: ", err);
			return null;
		}
	},

	// Function Make a POST request
	login: (userData) => {
		return API.commonPostFunc( `${API.authEndpoint}logins/`, userData );
	},

	register: (userData) => {
		return API.commonPostFunc( `${API.authEndpoint}signups/`, userData );
	},

	createChatRoom: (username) => {
		return API.commonPostFunc(`${API.authEndpoint}create/`, { username: username });
	},

	// Function Make a GET request
	isLogedIn: () => {
		return API.commonGetFunc(`${API.authEndpoint}usercheck/`);
	},

	logout: () => {
		return API.commonGetFunc(`${API.authEndpoint}logouts/`);
	},

	getUser: () => {
		return API.commonGetFunc( `${API.authEndpoint}userData/` );
	},

	getFriends: () => {
		return API.commonGetFunc( `${API.friendshipEndpoint}?type=friends` );
	},

	getConversatons:  () => {
		return API.commonGetFunc( API.chatEndpoint );
	},

	getConvMessages:  (room_id) => {
		return API.commonGetFunc( `${API.chatEndpoint}${room_id}` );
	},

	markMessagesAsRead: (room_id) => {
		API.commonGetFunc( `${API.chatEndpoint}read/${room_id}/` );
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

	makeGetRequest: async (url) => {
		const headers = {
			"Content-Type": "application/json"
		};
		const opts = {
			method: "GET",
			mode: "same-origin",
			headers,
			credentials: "include" // Ensure cookies are included
		};
		try {
			const response = await fetch(url, opts);
			return response;
		} catch (e) {
			console.log(e);
		}
		return null;
	}
};

export default API;
