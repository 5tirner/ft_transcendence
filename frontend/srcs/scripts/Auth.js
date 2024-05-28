import API from "./API.js";
import Router from "./Router.js";

const Auth = {
    user: null,

    postLogin: async (response, user) => {
        if (response.ok) {
            response = await response.json();
            const { username } = response;

            // save username and authToke to make feuture requests
            user = username;

            Router.go("/");
        } else {
            response = await response.json();
            console.info(response);

            //TODO : if the response regestration failed or login failed
            // wrong pass or user already exist ....
            // do smtg change in UI or display error msg ....
            // alert(response.message);
        }
    },

    logout: async () => {
        //TODO: delete JWT or anything that keep user authToke
        const response = await API.logout();
        console.log(response);
        Router.go("/login");
    },

    register: async (event) => {
        event.preventDefault();
        const user = {
            username: document.getElementById("register_name").value,
            email: document.getElementById("register_email").value,
            password: document.getElementById("register_password").value,
        };
        const response = await API.register(user);
        Auth.postLogin(response, user);
    },

    login: async (event) => {
        event.preventDefault();
        const username = document.getElementById("login_email").value;
        const password = document.getElementById("login_password").value;
        const user = { username, password };

        // send request to login API endpoint
        const response = await API.login(user);
        Auth.postLogin(response, {
            ...user,
            name: response.name,
        });
    },
    loginIntra: async (event) => {
        window.location.href = "http://127.0.0.1:8000/api/oauth/intra/";
    },
    isAuth: async (event) => {
        const response = await API.isLogedIn();
        console.log(response);
        if (response.ok) {
            const res = await response.json();
            const { isLoged } = res;
            console.log(res);
            Auth.user = res.data.username;
            return isLoged;
        }
        return false;
    },
    init: () => { },
};

export default Auth;

// make it a global object
window.Auth = Auth;
