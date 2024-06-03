import API from "../API.js";

function createListItem(parentElement) {
    // Create the main <li> element
    const listItem = document.createElement('li');
    listItem.className = 'list-group-item d-flex align-items-center justify-content-between px-1';

    // Create the left part of the list item (profile and message)
    const leftDiv = document.createElement('div');
    leftDiv.className = 'd-flex align-items-center';

    const profileContainer = document.createElement('div');
    profileContainer.className = 'profile-container';

    const profilePic = document.createElement('img');
    profilePic.src = 'https://cdn.intra.42.fr/users/7e57e4d04af367214c4a7e33fa9aa6bc/belkarto.JPG';
    profilePic.alt = 'Profile';
    profilePic.className = 'profile-pic';

    const statusDot = document.createElement('span');
    statusDot.className = 'status-dot online';

    profileContainer.appendChild(profilePic);
    profileContainer.appendChild(statusDot);

    const textContainer = document.createElement('div');
    textContainer.className = 'mx-2';

    const usernameDiv = document.createElement('div');
    usernameDiv.className = 'username';
    usernameDiv.textContent = 'Player1#0001';

    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.textContent = 'GG! I will win next time';

    textContainer.appendChild(usernameDiv);
    textContainer.appendChild(messageDiv);

    leftDiv.appendChild(profileContainer);
    leftDiv.appendChild(textContainer);

    // Create the right part of the list item (time and notification)
    const rightDiv = document.createElement('div');
    rightDiv.className = 'd-flex align-items-center flex-column';

    const timeDiv = document.createElement('div');
    timeDiv.className = 'time';
    timeDiv.textContent = '13:37PM';

    const notifDiv = document.createElement('div');
    notifDiv.className = 'notif mx-1 mt-2 visible';
    notifDiv.textContent = '+9';

    rightDiv.appendChild(timeDiv);
    rightDiv.appendChild(notifDiv);

    // Append both left and right parts to the main <li> element
    listItem.appendChild(leftDiv);
    listItem.appendChild(rightDiv);

    // Append the <li> element to the provided parent element
    parentElement.appendChild(listItem);
}

async function getConversations() {
    let response = await API.getConversatons();
    console.log(response);
    if (response.ok) {
        response = await response.json()
        console.log(response)
    }
}

export async function render_chat() {
    document.querySelector("#chat").style.display = "block";
    await getConversations();
}
