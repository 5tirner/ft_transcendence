import API from "../API.js";

function initSocketConnection(roomName, counter) {
    const token = localStorage.getItem("token");
    const chatSocket = new WebSocket(
        "ws://localhost:8000/ws/chat/" +
        roomName.substring(0, 8) +
        "/?token=" +
        token,
    );

    chatSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        console.log(e.data);
        const chatCon = document.querySelector(
            `div[data-room-name="${roomName.substring(0, 8)}"]`,
        );
        const msgBubble = document.createElement("div");
        msgBubble.classList.add("bubble");
        msgBubble.textContent = data.message;
        console.log(Auth.user);
        if (data.user != Auth.user) {
            msgBubble.classList.add("you");
        } else {
            msgBubble.classList.add("me");
        }
        chatCon.appendChild(msgBubble);
    };
    chatSocket.onclose = function(e) {
        console.error("chat socker closed");
    };
    const inputField = document.querySelector(
        `[data-chat="person${counter}-input"]`,
    );
    inputField.addEventListener("keydown", (event) => {
        if (event.key == "Enter") {
            if (inputField.value) {
                const message = inputField.value;
                chatSocket.send(
                    JSON.stringify({
                        message: message,
                    }),
                );
                inputField.value = "";
            }
        }
    });
}

async function getConversations() {
    const list = document.querySelector(".left .people");
    const mesgCon = document.querySelector(".right");
    const chatInput = document.querySelector(".write");
    list.innerHTML = "";
    const response = await API.getConversatons();
    if (response.ok) {
        const convs = await response.json();
        let counter = 1;
        for (let i = 0; i < convs.length; i++) {
            const obj = convs[i];
            const li = document.createElement("li");
            const span = document.createElement("span");
            const img = document.createElement("img");
            const chatCon = document.createElement("div");
            // const chatInput = document.createElement("div");
            const input = document.createElement("input");

            li.classList.add("person");
            li.dataset.chat = `person${counter}`;
            li.appendChild(img);
            li.appendChild(span);
            span.classList.add("name");

            chatCon.classList.add("chat");
            chatCon.dataset.chat = `person${counter}`;
            chatCon.dataset.roomName = obj.name.substring(0, 8);

            input.dataset.roomName = obj.name.substring(0, 8);
            input.dataset.chat = `person${counter}-input`;
            input.type = "text";

            for (const member of obj.members) {
                if (member.username !== Auth.user) {
                    span.textContent = member.username;
                    img.src = member.imgUrl;
                    const response = await API.getConvMessages(obj.id);
                    const messages = await response.json();
                    messages.forEach((msg) => {
                        const msgBubble = document.createElement("div");
                        msgBubble.classList.add("bubble");
                        msgBubble.textContent = msg.content;
                        if (msg.username != Auth.user) {
                            msgBubble.classList.add("you");
                        } else {
                            msgBubble.classList.add("me");
                        }
                        chatCon.appendChild(msgBubble);
                    });
                    break;
                }
            }

            list.appendChild(li);
            mesgCon.appendChild(chatCon);
            chatInput.appendChild(input);

            // initSocketConnection(obj.name, counter);
            counter++;
        }
    }
}

function setAciveChat(f, friends) {
    let chatInstence = {
        container: document.querySelector(".chat-con .right"),
        current: null,
        person: null,
        name: document.querySelector(".chat-con .right .top .name"),
    };
    const currentActiveChat = friends.list.querySelector(".active");
    if (currentActiveChat) {
        currentActiveChat.classList.remove("active");
    }
    f.classList.add("active");
    chatInstence.current = chatInstence.container.querySelector(".active-chat");
    chatInstence.person = f.getAttribute("data-chat");
    if (chatInstence.current)
        chatInstence.current.classList.remove("active-chat");
    chatInstence.container
        .querySelector('[data-chat="' + chatInstence.person + '"]')
        .classList.add("active-chat");
    friends.name = f.querySelector(".name").innerText;
    chatInstence.name.textContent = friends.name;
    document.querySelectorAll(".write input").forEach((input) => {
        input.style.display = "none";
    });

    chatInstence.container.querySelector(
        `[data-chat="${chatInstence.person}-input"]`,
    ).style.display = "block";
}

export async function chat_page() {
    document.querySelector("#nav_bar").style.display = "block";
    document.querySelector("section#chat").style.display = "block";
    await getConversations();

    let friends = {
        list: document.querySelector("ul.people"),
        all: document.querySelectorAll(".left .person"),
        name: "",
    };
    friends.all.forEach((f) => {
        f.addEventListener("mousedown", () => {
            f.classList.contains("active") || setAciveChat(f, friends);
        });
    });
}
