const stylesheet = `
#platform {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: nowrap;
}

#sidebar {
    flex-grow: 1;
    position: relative;
    min-width: 85px;
}

#middle {
    padding-top: 60px !important;
    display: flex;
    flex-direction: column;
    row-gap: 3rem;
    align-items: center;
    flex-grow: 16;
    padding: 1rem 0;
    min-width: 300px;
    max-width: 75%;
}

#middlePlayerRank {
    width: 90%;
    height: 25%;
    border: 1px solid rgba(100, 100, 100, 0.25);
    position: relative;
    border-radius: 18px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
}

#middlePlayerRank .title {
    width: 100%;
    padding: 10px 10px;
    box-sizing: border-box; /* Ensures padding is included in width */
}

#middlePlayerRank .component-hold {
    flex-grow: 1;
    border-bottom-left-radius: 18px;
    border-bottom-right-radius: 18px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

#chat {
    flex-grow: 6;
    padding: 1rem;
    min-width: 250px;
    border-left: 1px solid rgba(100, 100, 100, 0.25) !important;
}
`;

export { stylesheet };