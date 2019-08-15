const socket = io();
const chatForm = document.querySelector('#message-form');

socket.on('joined', (message) => {
  console.log(message);
});

socket.on('alert', (alert) => {
  console.log(alert)
})

socket.on('newMessage', (message) => {
  console.log(message);
});

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = e.target.elements.message.value;
  socket.emit('newMessage', message)
});