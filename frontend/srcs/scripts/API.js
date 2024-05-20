const API = {
    authEndpoint: "http://localhost:8000/api/auth/",
    chatEndpoint: "http://localhost:8001/api/chatrooms/",


    // ADD HERE ALL THE OTHER API FUNCTIONS
    login: async (user) => {
        return await API.makePostRequest(API.authEndpoint + "login/", user);
    },

    register: async (user) => {
        return await API.makePostRequest(API.authEndpoint + "register/", user);
    },

    getUser: async () => {
        return await API.makeGetRequest(API.authEndpoint + "user/");
    },

    getConversatons: async () => {
        return await API.makeGetRequest(API.chatEndpoint);
    },

    getConvMessages: async (chatId) => {
        return await API.makeGetRequest(API.chatEndpoint + chatId);
    },

    makePostRequest: async (url, data) => {
        const token = localStorage.getItem("token");
        const headers = {
            "Content-Type": "application/json",
        };
        if (token) {
            headers.Authorization = `Token ${token}`;
        }
        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data),
        });
        return response;
    },

    makeGetRequest: async (url) => {
        const token = localStorage.getItem("token");
        const headers = {
            "Content-Type": "application/json",
        };
        if (token) {
            headers.Authorization = `Token ${token}`;
        }
        const response = await fetch(url, {
            headers: headers,
        });
        return response;
    },
};

export default API;
