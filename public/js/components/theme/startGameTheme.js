const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(`
:host
{
  width: 90%;
  height: 35%;
  position: relative;
  border-radius: 20px;
  border: 1px solid rgba(100, 100, 100, 0.25);
}

// img{
//   width: 100%;
//   height: 100%;
//   border-radius: 20px;
//   margin-top: 30px;
// }
a
{
  position: absolute;
  top: 90%;
  left: 50%;
  transform: translate(-50%, -50%);
}
`);

export { stylesheet };
