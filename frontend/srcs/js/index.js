import { router } from "./service/router.js";

import Game from "./view/component/Game.js";
import Home from "./view/component/Home.js";
import Pong from "./view/component/Pong.js";
import Login from "./view/component/Login.js";
import History from "./view/component/History.js";
import Sidebar from "./view/component/Sidebar.js";
import PongTour from "./view/component/PongTour.js";
import Platform from "./view/component/Platform.js";
import TicTacToe from "./view/component/TicTacToe.js";
import Statistic from "./view/component/Statistic.js";
import PongLocal from "./view/component/PongLocal.js";
import TicAnim from "./view/component/auxiliar/TicAnim.js";
import PongAnim from "./view/component/auxiliar/PongAnim.js";
import ResultMsg from "./view/component/auxiliar/ResultMsg.js";
import ConfirmMsg from "./view/component/auxiliar/ConfirmMsg.js";
import AbortButton from "./view/component/auxiliar/AbortButton.js";
import Setting from './view/component/Setting.js';
import Profile from './view/component/Profile.js';
// import ChatComponent from "./view/chat/chat.js";
// import { FriendView } from "./view/friendUI.js";

import MainView from "./view/mainUI.js";

// window.prevState = null;
// window.goBack = true;
// 
window.router = router;
window.component = {};

document.addEventListener("DOMContentLoaded", () => {
	window.component = {
	   root: document.getElementById('root'),
		home: document.createElement('home-view'),
		main: document.createElement('main-view'),
		midl: Object.assign(document.createElement('div'), { id: 'middle-view'})
	};
	router.redirecto(window.location.pathname);
});
