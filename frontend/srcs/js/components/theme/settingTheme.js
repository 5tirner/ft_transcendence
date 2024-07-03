export const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(`
    .profile-card {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        margin: 0;
        position: relative;
    }
    .profile-card .section {
        border-radius: 20px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        padding: 20px;
        width: 500px;
        text-align: center;
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
        padding-top: 20px;
    }
    .profile-card .info div p {
        margin: 3px 0;
        font-size: 14px;
    }
    .blur
    {
        -webkit-filter: blur(10px); 
        -moz-filter: blur(10px);
        -o-filter: blur(10px);
        -ms-filter: blur(10px); 
    }
    .profile-card #float
    {
        border-radius: 18px;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 102;
        justify-content: center;
        text-align: center;
        align-items: center;
        background-color: rgba(0, 0, 0, .15);
    }
    .profile-card #float form
    {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    .profile-card #float form input
    {
        color: white;
        border: 2px solid #8707ff;
        border-radius: 10px;
        padding: 10px 25px;
        background: transparent;
        max-width: 190px;
    }

    .input:active {
        border: none;
        box-shadow: 2px 2px 15px #8707ff inset;
    }

    .profile-card .section .edit-btn
    {
        display: flex;
        flex-direction: column;
        justify-content: end;
    }

`);