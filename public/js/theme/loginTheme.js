export const stylesheet = `
a{
  text-decoration: none;
}

.bluer{
    width: 100% !important;
    height: 100% !important;
    filter: blur(5px);
    backdrop-filter: blur(5px);
    position: absolute;
    left: 0;
    top: 0;
    z-index: 9;
  }

  .login-form {
    width: 35%;
    background-color: #1d203e;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    z-index: 99;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: ease-in;
    transition-delay: 5s;
    padding-top: 20px;
    padding-bottom: 40px;
    box-shadow: rgba(68, 68, 68, 0.1) 0px 4px 16px, rgba(68, 68, 68, 0.1) 0px 8px 24px, rgba(68, 68, 68, 0.1) 0px 16px 56px;  }
  
  .sub-login-form {
    width: 75%;
    height: 100%;
    text-align: center;
  }
  
  .logo {
    color: #fff;
    font-weight: 400;
    padding-top: 10px;
    padding-bottom: 20px;
  }
  
  .google-btn {
    padding-top: 10px;
    padding-bottom: 10px;
    display: flex;
    justify-content: center;

  }
  
  a .intra-42
  {
    background: rgb(190, 60, 237) !important;
    background: linear-gradient(
      90deg,
      rgba(190, 60, 237, 1) 43%,
      rgb(158, 165, 179) 100%
    ) !important;
    border: none !important;
  }

  .intra-btn {
    padding-top: 10px;
    padding-bottom: 10px;
    display: flex;
    justify-content: center;
  }
  /* --------------- Google + Intra buttons -------------- */
  .button-23 {
    border: 0.5px solid #bbbbbb;
    opacity: 1;
    border-radius: 8px;
    box-sizing: border-box;
    color: #fff;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-family: "Press Start 2P", sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    margin: 0;
    outline: none;
    padding: 13px 23px;
    position: relative;
    text-align: center;
    text-decoration: none;
    touch-action: manipulation;
    transition: box-shadow 0.2s, -ms-transform 0.1s, -webkit-transform 0.1s,
      transform 0.1s;
    user-select: none;
    -webkit-user-select: none;
    background: none;
    width: 75%;
    font-size: 10px;
  }
  
  .button-23:focus-visible {
    box-shadow: #222222 0 0 0 2px, rgba(255, 255, 255, 0.8) 0 0 0 4px;
    transition: box-shadow 0.2s;
    outline: none;
    border-color: inherit;
    -webkit-box-shadow: none;
    box-shadow: none;
  }
  
  .button-23:active {
    transform: scale(0.96);
    outline: none;
  }
  
  .button-23 span {
    font-size: 14px;
  }
`;


