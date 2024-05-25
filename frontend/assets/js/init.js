import Router from "./router.js";

window.onload = Router.loadContent;

document.addEventListener("click", e => {
  e.preventDefault();
  const { target } = e;
  if (!target.matches("a")) return;
  Router.handleLinkClick(e);
});

window.onpopstate = Router.loadContent;