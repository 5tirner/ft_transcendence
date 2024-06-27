export const stylesheet = `
nav {
  padding: 20px 200px 20px 200px !important;
  display:flex;
  display-direction:row;
  justify-content: space-between;
}

a {
  color: #fff !important;
  text-decoration: none;

}

.home-buttons{
  padding: 6px 20px 6px 20px;
  border-radius: 6px;
  outline: none;
  border: none;
  color: #fff;
  font-size: 12px;
  background: rgb(190, 60, 237) !important;
  background: linear-gradient(
    90deg,
    rgba(190, 60, 237, 1) 43%,
    rgb(158, 165, 179) 100%
  ) !important;
}

.discover-btn {
    font-family: 'Press Start 2P' !important;
  padding: 15px 80px !important;
}

.home
{
  width: 50%;
  height: calc(100vh - 100px);
  color: #fff;
  display: flex;
  flex-direction: column;
  row-gap: 8%;
  justify-content: center;
  padding-left: 200px;
}

#card-hold .login-form
{
  box-shadow: rgba(0, 0, 0, 0.5) 0px 3px 8px;
}
`;