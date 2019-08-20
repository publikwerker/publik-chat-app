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
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

// OPTIONS
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true});

const autoscroll = () => {
  //new message element
  const $newMessage = $messages.lastElementChild;

  //height of new message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  //visible height
  const visibleHeight = $messages.offsetHeight;

  //height of messages container
  const contentHeight = $messages.scrollHeight;

  //how far has user scrolled
  const scrollOffset = $messages.scrollTop + visibleHeight;

  if (contentHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = contentHeight;
  }

  console.log(newMessageMargin)

}

socket.on('joined', (data) => {
  const html = Mustache.render(messageTemplate, {
    username: data.username,
    message: data.message,
    createdAt: moment(data.createdAt).format('h:mm A')
  });
  $messages.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMessage', (data) => {
  const html = Mustache.render(locationLinkTemplate, {
    url: data.url,
    username: data.username,
    createdAt: moment(data.createdAt).format('h:mm A')
  });
  $messages.insertAdjacentHTML('beforeend', html);
  autoscroll();
});

socket.on('alert', (alert) => {
  const html = Mustache.render(messageTemplate, {
    username: alert.username,
    message: alert.message,
    createdAt: moment(alert.createdAt).format('h:mm A')
  });
  $messages.insertAdjacentHTML('beforeend', html);
  autoscroll();
});

socket.on('newMessage', (data) => {
  const html = Mustache.render(messageTemplate, {
    username: data.username,
    message: data.message,
    createdAt: moment(data.createdAt).format('h:mm A')
  });
  $messages.insertAdjacentHTML('beforeend', html);
  autoscroll();
});

socket.on('roomData', ({ room, users }) => {
  console.log(users)
  const html = Mustache.render(sidebarTemplate, {
    room,
    users: users.roomies
  });
  document.querySelector('#sidebar').innerHTML = html;
  autoscroll();
})

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

socket.emit('join', { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = '/';
  }
})