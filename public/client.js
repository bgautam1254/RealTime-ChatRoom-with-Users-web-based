
const socket = io();

// Prompt screen will continue appering untill you enter your name
let newUserName;
do {
    newUserName = prompt('Please enter your userName: ');
} while (!newUserName || /\s/.test(newUserName) || newUserName.length == 0)


// information of particular connected person is send to server to tell that user is connected
socket.emit("newUser", newUserName);

// when user joins the chat it displays that user joined the chat with date and time
socket.on('joinsChat', (newUser) => {
    let mainDiv = document.createElement('div')
    let className = "join"
    mainDiv.classList.add(className, 'message')

    let markup = "<b><h4>" + newUser + "    " + currentdateTime() + "</h4></b><b>joins the chat</b>";

    mainDiv.innerHTML = markup
    messageArea.appendChild(mainDiv)
    scrollToBottom()

});


// when user leaves the chat it displays that user joined the chat with date and time 
socket.on('leftChat', (oldUser) => {
    let mainDiv = document.createElement('div')
    let className = "left"
    mainDiv.classList.add(className, 'message')

    let markup = "<b><h4>" + oldUser + "    " + currentdateTime() + "</h4></b><b>left the chat</b>";

    mainDiv.innerHTML = markup;
    messageArea.appendChild(mainDiv);
    scrollToBottom();
});


// type message in text area for sending
const textarea = document.getElementById("textarea");
// Send above typed message with the help of Enter key
textarea.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        sendMessage(e.target.value);
    }
});

// send button is clicked
const sendButton = document.getElementById('sendit');
// Send above typed message with the click on send button
sendButton.addEventListener("click", () => {
    sendMessage(textarea.value);
});


// outgoing message handler 
const sendMessage = (vmessage) => {
    let userTypedMessage =
    {
        user: newUserName,
        message: vmessage.trim()
    }

    // Current typed message is appended at right side of chat
    appendMessage(userTypedMessage, 'outgoing')
    textarea.value = ''
    scrollToBottom()

    // Current typed message is send to server
    socket.emit('messageToServer', userTypedMessage)

    // audioSend tone
    // audioSend.play();
}


// Recieve messages 
socket.on('messageToAllClients', (userTypedMessage) => {
    // audioRecieved tone
    audioRecieved.play();
    appendMessage(userTypedMessage, 'incoming')
    scrollToBottom()
});



// server to client messages
const messageArea = document.querySelector('.messageArea');
// incoming message handler
const appendMessage = (userTypedMessage, type) => {
    let mainDiv = document.createElement('div')
    let className = type
    mainDiv.classList.add(className, 'message')

    let markup = "<h4>" + userTypedMessage.user + "    " + currentdateTime() + "</h4>" + `<p>${userTypedMessage.message}</p>`;

    mainDiv.innerHTML = markup
    messageArea.appendChild(mainDiv)
}


// Audio will play on new messages
const audioRecieved = new Audio('./recieved.mp3');
const audioSend = new Audio('./sent.mp3');

// when messages are full it automatically scrolls the chat
const scrollToBottom = () => {
    messageArea.scrollTop = messageArea.scrollHeight
}


const currentdateTime = () => {
    date = new Date();
    newDate = date.toJSON().slice(8, 10) + "" + date.toJSON().slice(4, 7);
    time = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    return (newDate + "---" + time);
}