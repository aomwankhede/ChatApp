const socket = io('http://localhost:8000');

//Get DOM elements:-
const form = document.getElementsByClassName('send-container')[0];
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

// Audio that will play on receiving message:-
var audio = new Audio('ting.mp3');

//Function that will append text to container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position == 'left') { audio.play(); }
}

//Ask new user for name and let the server knows
const name = prompt("Enter your name to join")
socket.emit('new-user-joined', name)

//If new user joins receive the name from server
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right')
})

//If the server sends a message receive it
socket.on('receive', data => {
    append(`${data.name}:${data.message}`, 'left')
})

// If the user leaves the chat append the info to the container
socket.on('leave', name => {
    append(`${name} left the chat`, 'left')
})

// If the form gets submitted send the message to the server
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You:${message}`, 'right')
    socket.emit('send', message)
    messageInput.value = ''
})