const API = {
    authEndpoint: "http://localhost:8000/api/auth/",
    chatEndpoint: "http://localhost:8000/api/chatrooms/",


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
        const headers = {
            "Content-Type": "application/json",
        };
        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data),
        });
        return response;
    },

    makeGetRequest: async (url) => {
        const headers = {
            "Content-Type": "application/json",
            "Cookie": "test=asdfdasf",
            "nonono": "tkhawer",
        };
        const response = await fetch(url, {
            method: "GET",
            mode: "same-origin",
            headers: headers,
            credentials: "same-origin",
        });
        return response;
    },
};

export default API;
