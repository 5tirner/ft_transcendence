export const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(`
    :host
    {
        width: 100%;
        heigth: 100%;
        // background-color: red;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    img
    {
        width: 100%;
        height: 100%;
        background-color: green;
`);