export const stylesheet = `
    #game-page
    {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-contetnt: center;
        align-items: center;
    }
    #game-section
    {
        width: 95%;
        height: 600px;
        border: 1px solid rgba(255, 255, 255, 0.25);
    }
    #game-mode-section
    {
        .game-mode-title
        {
            padding: 10px 15px;
        }
        .components
        {
            // border: 1px solid rgba(255, 255, 255, 0.25);
            border-radius: 18px;
            display: flex;
            flex-direction: row;
            width: 100%;
            height: 90%;
            justify-content: space-around;
            gap: 2rem;
        }
        height: 230px;
        width: 90%;
    }
`;