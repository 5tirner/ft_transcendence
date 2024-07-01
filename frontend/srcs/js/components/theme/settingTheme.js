export const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(`
    :host {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        margin: 0;
        // font-family: 'Roboto', sans-serif;
        // background: linear-gradient(135deg, #ffafbd, #ffc3a0);
    }
    .profile-card {
        // background: white;
        border-radius: 20px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        padding: 20px;
        width: 500px;
        text-align: center;
        position: relative;
    }
    .profile-card img {
        border-radius: 50%;
        width: 100px;
        height: 100px;
        object-fit: cover;
        position: relative;
    }
    .profile-card .edit-image {
        position: absolute;
        top: 88px;
        right: 220px;
        background: #007bff;
        border: none;
        border-radius: 50%;
        color: white;
        width: 30px;
        height: 30px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .profile-card h2 {
        margin: 10px 0 5px;
        font-size: 22px;
    }
    .profile-card p {
        margin: 5px 0;
        color: gray;
    }
    .profile-card .badge {
        display: inline-block;
        padding: 5px 10px;
        background: #d4f4d2;
        color: #34a853;
        border-radius: 12px;
        font-size: 12px;
        margin-bottom: 10px;
    }
    .profile-card .info {
        display: flex;
        justify-content: space-between;
        margin: 10px 0;
    }
    .profile-card .info div {
        text-align: left;
    }
    .profile-card .info div p {
        margin: 3px 0;
        font-size: 14px;
    }
    .profile-card .edit-btn {
        background: none;
        border: none;
        cursor: pointer;
        color: #007bff;
    }
`);