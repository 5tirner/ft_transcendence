import { Router } from './router.js';
import { routes } from "./routes.js";
 
window.global = {};

const App = () => {
  global.router = new Router();

  try {
    global.router.addRoutes(routes);
    global.router.init();
  } catch (err) {
    console.log(err);
  }
};

export default App;