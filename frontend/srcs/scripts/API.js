const API = {
    authEndpoint: "http://127.0.0.1:8000/api/auth/",
    chatEndpoint: "http://127.0.0.1:8000/api/chat/",


    // ADD HERE ALL THE OTHER API FUNCTIONS
    login: async (userData) => {
        return await API.makePostRequest(API.authEndpoint + "login/", userData);
    },

    // isLogedIn: async () => {
    //     return await API.makeGetRequest(API.authEndpoint);
    // },

    register: async (userData) => {
        return await API.makePostRequest(API.authEndpoint + "register/", userData);
    },

    getUser: async () => {
        return await API.makeGetRequest(API.authEndpoint + "userData/");
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
        };
        try {
            const response = await fetch(url, {
                method: "GET",
                mode: "same-origin",
                headers: headers,
                credentials: "include", // Ensure cookies are included
            });
            return response;
        } catch (e) {
            console.log("error", e);
        }
        return null;
    },
};

export default API;
