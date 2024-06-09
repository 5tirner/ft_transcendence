export function convHeader(userData) {
    // Create the main container element
    const conversationHeader = document.createElement('div');
    conversationHeader.classList.add('conve-header');

    // Create the arrow icon
    const arrowIcon = document.createElement('img');
    arrowIcon.addEventListener("click", event => {
        const conv = document.querySelector(".chat-conv-wrapper");
        console.log(conv);
        conv.style.display = "none";
    })
    arrowIcon.classList.add('frame-icon');
    arrowIcon.alt = '';
    arrowIcon.src = './svg_dir/arrow.svg';

    // Create the user avatar
    const userAvatar = document.createElement('img');
    userAvatar.classList.add('user-avatar');
    userAvatar.alt = 'user';
    userAvatar.src = userData.avatar;

    // Create the username container
    const usernameContainer = document.createElement('div');
    usernameContainer.classList.add('username-conv');
    usernameContainer.textContent = userData.username;  // Assuming username is provided

    // Create the status container
    const statusContainer = document.createElement('div');
    statusContainer.classList.add('status');
    statusContainer.textContent = "online";

    // Create the status dot
    const statusDot = document.createElement('div');
    statusDot.classList.add('status-dot', true ? 'online' : 'offline'); // Set class based on online status

    // Create the controller icon
    const controllerIcon = document.createElement('img');
    controllerIcon.classList.add('controler-icon');
    controllerIcon.alt = '';
    controllerIcon.src = './svg_dir/GameController.svg';

    // Append elements to the container
    conversationHeader.appendChild(arrowIcon);
    conversationHeader.appendChild(userAvatar);
    conversationHeader.appendChild(usernameContainer);
    conversationHeader.appendChild(statusContainer);
    conversationHeader.appendChild(statusDot);
    conversationHeader.appendChild(controllerIcon);

    return conversationHeader;
}
