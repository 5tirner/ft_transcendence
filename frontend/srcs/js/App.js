import { Router } from "./router.js";
import { routes } from "./routes.js";

window.global = {};

const App = async () => {
	global.router = new Router();

	try {
		global.router.addRoutes(routes);
		await global.router.init();
	} catch (err) {
		console.log(err);
	}
};

export default App;

