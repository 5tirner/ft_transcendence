const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(`
:host
{
  flex-grow: 0.5;
  background-color: green;
}

:root {
  --header-height: 3rem;
  --nav-width: 85px;
  --first-color: #1D203E;
  --first-color-light: #afa5d9;
  --white-color: #f7f6fb;
  --body-font: "Press Start 2P", sans-serif !important;
  --normal-font-size: 1rem;
  --z-fixed: 100;
}
*,
::before,
::after {
  box-sizing: border-box;
}

a {
    position: relative;
    text-decoration: none !important;
    color: #fff;
}

.l-navbar {
  box-shadow: rgba(100, 100, 100, 0.15) 1.95px 1.95px 2.6px !important;
  position: absolute;
  top: 0;
  width: var(--nav-width);
  height: 100vh;
  background-color: var(--first-color);
  padding: 0.5rem 1rem 0 0;
  transition: 0.5s;
  z-index: var(--z-fixed);
}

.nav {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}

.nav_logo,
.nav_link {
  display: grid;
  grid-template-columns: max-content max-content;
  align-items: center;
  column-gap: 1rem;
  padding: 0.5rem 0 0.5rem 1.5rem;
}

.nav_logo {
  margin-bottom: 2rem;
}

.nav_logo-icon {
  font-size: 1.75rem;
  color: var(--white-color);
}

.nav_logo-name {
  color: var(--white-color);
  font-weight: 700;
}
.nav_link {
  position: relative;
  color: var(--first-color-light);
  margin-bottom: 1.5rem;
  transition: 0.3s;
}
.nav_link:hover {
  color: var(--white-color);
}
.nav_icon {
  font-size: 1.65rem;
}
.active {
  color: var(--white-color);
}
.height-100 {
  height: 100vh;
}
// @media screen and (min-width: 768px) {
//   body {
//     margin: calc(var(--header-height) + 1rem) 0 0 0;
//     padding-left: calc(var(--nav-width) + 2rem);
//   }
//   .header {
//     height: calc(var(--header-height) + 1rem);
//     padding: 0 2rem 0 calc(var(--nav-width) + 2rem);
//   }
//   .header_img {
//     width: 40px;
//     height: 40px;
//   }
//   .header_img img {
//     width: 45px;
//   }
//   .l-navbar {
//     left: 0;
//     padding: 1rem 1rem 0 0;
//   }
//   .show {
//     width: calc(var(--nav-width) + 156px);
//   }
//   .body-pd {
//     padding-left: calc(var(--nav-width) + 188px);
//   }
// }

.green_dot::before
{
    content: "";
    position: absolute;
    bottom: 6px;
    right: 14px;
    width:10px;
    height:10px;
    background-color: rgb(20, 202, 20);
    border-radius: 50%;
}
`);

export { stylesheet };
