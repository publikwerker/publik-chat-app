const socket = io();
const chatForm = document.querySelector('#message-form');

socket.on('joined', (message) => {
  console.log(message);
});

socket.on('message', (message) => {
  console.log(message);
})

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

document.querySelector('#send-location').addEventListener('click', () => {
   if (!navigator.geolocation) {
     return alert('Geolocation is not supported by your browser');
   }

   navigator.geolocation.getCurrentPosition((position) => {
     socket.emit('sendLocation', {
       lat: position.coords.latitude, 
       long: position.coords.longitude
      });
   });
});