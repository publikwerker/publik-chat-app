const socket = io();

// ELEMENTS
const $chatForm = document.querySelector('#message-form');
const $chatFormInput = $chatForm.querySelector('#message');
const $chatFormButton = $chatForm.querySelector('#send') ;
const $locateButton = document.querySelector('#send-location');

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

$chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // disable button until fetch is complete
  $chatFormButton.setAttribute('disabled', 'disabled');
  // clear message field, refocus
  const message = e.target.elements.message.value;
  socket.emit('newMessage', message, (error) => {
    // reenable button -- fetch is complete
    $chatFormButton.removeAttribute('disabled');
    $chatFormInput.value = '';
    $chatFormInput.focus();
    if (error) {
      return console.log(error)
    }
    console.log(`Message delivered.`)
  })
})

$locateButton
  .addEventListener('click', () => {
    if (!navigator.geolocation) {
      return alert('Geolocation is not supported by your browser');
    }
    // disable button until fetch is complete
    $locateButton.setAttribute('disabled', 'disabled');
    navigator.geolocation.getCurrentPosition((position) => {
      socket.emit('sendLocation', {
        lat: position.coords.latitude, 
        long: position.coords.longitude
      }, (error) => {
        if(error){
          return console.log(error)
        }
        // reenable button -- fetch is complete
        $locateButton.removeAttribute('disabled');
        $chatFormInput.focus();
        console.log(`Location shared.`)
      });
   });
});

