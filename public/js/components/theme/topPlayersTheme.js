const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(`
:host{
    position: relative;
    width: 150px;
    height: 150px;
}

.container
  {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 15px;
  }
  .avatar {
      width: 50%;
      height: 50%;
      border-radius: 12px;
      background-color: #fff;
  }
  
  .avatar img{
      width: 100%;
      height: 100%;
      border-radius: 12px;
  }
  
  .name {
      width: 100%;
      height: 20%;
      text-align: center;
      justify-content: center;
      algin-items: center;
      line-height: 4;
      color:#fff;
      font-size: 8px;
  
  }
  .points {
      color: darkgray;
      width: 100%;
      height: 20%;
      /* line-height: 2; */
      text-align: center;
      font-size: 6px;
  }
  

`);

export { stylesheet };
