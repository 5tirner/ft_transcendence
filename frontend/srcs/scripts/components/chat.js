import API from "../API.js";

function createReceivedMessage(parrentDiv, msgData) {
    // Create the main container element
    const messageContainer = document.createElement('div');
    messageContainer.className = 'recv-message-con d-flex flex-column';

    // Create the message paragraph element
    const messageParagraph = document.createElement('p');
    messageParagraph.className = 'recv-message p-2 m-1';
    messageParagraph.textContent = msgData.message;

    // Create the message time element
    const messageTime = document.createElement('div');
    messageTime.className = 'recv-message-time mx-1';
    messageTime.textContent = msgData.date;

    // Append message and time elements to the container
    messageContainer.appendChild(messageParagraph);
    messageContainer.appendChild(messageTime);

    return messageContainer;
}

function createListItem(parentElement, user) {
    // Create the main <li> element
    const listItem = document.createElement('li');
    listItem.className = 'list-group-item d-flex align-items-center justify-content-between px-1';

    // Create the left part of the list item (profile and message)
    const leftDiv = document.createElement('div');
    leftDiv.className = 'd-flex align-items-center';

    // div that contain user profile
    const profileContainer = document.createElement('div');
    profileContainer.className = 'profile-container';

    // user profile image
    const profilePic = document.createElement('img');
    profilePic.src = user.avatar;
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
    usernameDiv.textContent = user.username;

    // display last message sent in chat
    // const messageDiv = document.createElement('div');
    // messageDiv.className = 'message';
    // messageDiv.textContent = 'GG! I will win next time';

    textContainer.appendChild(usernameDiv);
    // textContainer.appendChild(messageDiv);

    leftDiv.appendChild(profileContainer);
    leftDiv.appendChild(textContainer);

    // NOTE:
    // time and unreaded messages count
    //
    // Create the right part of the list item (time and notification)
    // const rightDiv = document.createElement('div');
    // rightDiv.className = 'd-flex align-items-center flex-column';
    //
    // const timeDiv = document.createElement('div');
    // timeDiv.className = 'time';
    // timeDiv.textContent = '13:37PM';
    //
    // const notifDiv = document.createElement('div');
    // notifDiv.className = 'notif mx-1 mt-2 visible';
    // notifDiv.textContent = '+9';
    //
    // rightDiv.appendChild(timeDiv);
    // rightDiv.appendChild(notifDiv);

    // Append both left and right parts to the main <li> element
    listItem.appendChild(leftDiv);
    // listItem.appendChild(rightDiv);

    // Append the <li> element to the provided parent element
    parentElement.appendChild(listItem);
    listItem.addEventListener("click", event => {
        console.log(event.currentTarget)
        const conv = document.querySelector(".chat-conv-wrapper");
        conv.style.display = "block";
    })
}

window.addList = createListItem;

async function getConversations() {
    const ulElement = document.querySelector("#chat ul");
    let response = await API.getConversatons();
    console.log(response);
    if (response.ok) {
        response = await response.json()
        response.forEach(chatConv => {
            createListItem(ulElement, chatConv.user);
        })
    }
}

export async function render_chat() {
    document.querySelector("#chat").style.display = "block";
    await getConversations();
    const backButton = document.querySelector(".frame-icon");
    backButton.addEventListener("click", event => {
        const conv = document.querySelector(".chat-conv-wrapper");
        console.log(conv);
        conv.style.display = "none";
    })
}
