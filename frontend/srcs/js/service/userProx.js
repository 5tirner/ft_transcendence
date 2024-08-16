export const auth = {};
const options = {
  get: (target, prop, receiver) => {
    return target[prop];
  },
  set: (target, prop, value) => {
    target[prop] = value;
    if (prop === "user") {
      console.log("user changed");
    }
  }
};
export const userProx = new Proxy(auth, options);