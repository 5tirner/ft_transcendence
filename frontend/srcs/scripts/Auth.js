import API from "./API.js";
import Router from "./Router.js";

const Auth = {
  isLoggedIn: false,
  account: null,

  postLogin: (response, user) => {
    if (response.ok) {
      // TODO: add user key or cookie (JWT)

      Auth.isLoggedIn = true;
      Auth.account = user;
      Router.go("/account");
    } else {
      //TODO : if the response regestration failed or login failed
      // wrong pass or user already exist ....
      // do smtg change in UI or display error msg ....
      alert(response.message);
    }
  },

  logout: async () => {
    console.log("heeeere");
    Auth.isLoggedIn = false;
    Auth.account = null;
    //TODO: delete JWT or anything that keep user auth

    // const user = {};
    // await API.logout(user);
    Router.go("/login");
  },

  register: async (event) => {
    event.preventDefault();
    const user = {
      name: document.getElementById("register_name").value,
      email: document.getElementById("register_email").value,
      password: document.getElementById("register_password").value,
    };
    // const response = await API.register(user);
    const response = { ok: true };
    Auth.postLogin(response, user);
  },

  login: async (event) => {
    event.preventDefault();
    const user = {
      email: document.getElementById("login_email").value,
      password: document.getElementById("login_password").value,
    };

    // const response = await API.login(user);
    const response = { ok: true };
    Auth.postLogin(response, {
      ...user,
      name: response.name,
    });
  },

  init: () => {},
};

export default Auth;

// make it a global object
window.Auth = Auth;
