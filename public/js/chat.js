const socket = io();

// ELEMENTS
const $chatForm = document.querySelector('#message-form');
const $chatFormInput = $chatForm.querySelector('#message');
const $chatFormButton = $chatForm.querySelector('#send') ;
const $locateButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

// TEMPLATES
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationLinkTemplate = document.querySelector('#location-link-template').innerHTML;

socket.on('joined', (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    message: message.text
  });
  $messages.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMessage', (url) => {
  console.log(url);
  const html = Mustache.render(locationLinkTemplate, {
    url: url.text
  });
  $messages.insertAdjacentHTML('beforeend', html);
});

socket.on('message', (message) => {
  console.log(message);
  const html = Mustache.render(locationLinkTemplate, {
    message: message.text
  });
  $messages.insertAdjacentHTML('beforeend', html);
});

socket.on('alert', (alert) => {
  console.log(alert);
  const html = Mustache.render(messageTemplate, {
    message: alert.text
  });
  $messages.insertAdjacentHTML('beforeend', html);
});

socket.on('newMessage', (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    message: message.text
  });
  $messages.insertAdjacentHTML('beforeend', html);
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
  });
});

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

