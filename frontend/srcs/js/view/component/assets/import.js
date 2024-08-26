import Game from "../Game.js";
import Home from "../Home.js";
import Pong from "../Pong.js";
import Login from "../Login.js";
import Setting from "../Setting.js";
import Profile from "../Profile.js";
import History from "../History.js";
import Sidebar from "../Sidebar.js";
import PongTour from "../PongTour.js";
import Platform from "../Platform.js";
import TicTacToe from "../TicTacToe.js";
import Statistic from "../Statistic.js";
import PongLocal from "../PongLocal.js";
import GameInvite from "../GameRequest.js";
import Tfa from "../TwoFactAuth.js";

import ChatComponent from "../../chat/chat.js";

import TicAnim from "../auxiliar/TicAnim.js";
import PongAnim from "../auxiliar/PongAnim.js";
import ResultMsg from "../auxiliar/ResultMsg.js";
import ConfirmMsg from "../auxiliar/ConfirmMsg.js";
import AbortButton from "../auxiliar/AbortButton.js";
import UserUpdate from "../auxiliar/ChangeUsername.js";
import UpdateAvatar from "../auxiliar/ChangeAvatar.js";

import Notification  from "../auxiliar/notification/Notification.js";

const danger = new Notification("Error", 'bx-error', '#e26159');
const info = new Notification("Important", 'bx-info-circle', '#1b958d');
const success = new Notification("Success", 'bx-check-circle', '#0ad406');

export {
  Game,
  Home,
  Pong,
  Login,
  Setting,
  Profile,
  History,
  Sidebar,
  PongTour,
  Platform,
  TicTacToe,
  Statistic,
  PongLocal,
  GameInvite,
  TicAnim,
  PongAnim,
  ResultMsg,
  ConfirmMsg,
  AbortButton,
  UserUpdate,
  UpdateAvatar,
  ChatComponent,
  Tfa,
  danger,
  info,
  success
};
