import API from '../API.js';
import { getConversations } from './chatList.js';

function createMessageBuble(parrentDiv, msgData) {
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

export async function render_chat() {
    document.querySelector('#chat').style.display = 'block';
    await getConversations();
}
