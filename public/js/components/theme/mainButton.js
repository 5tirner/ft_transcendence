const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(`
:host
{
  z-index: 101;
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

`);

export { stylesheet };
