const server = require('./app');
const PORT = process.env.PORT;
const chalk = require('chalk');
const socketio = require('socket.io');
const io = socketio(server);
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages');

// server (emit) => client (receive) - joined, newMessage
// client (emit) => server (receive) - newMessage

io.on('connection', (socket) => {
  console.log(chalk.blue.bold(`New WebSocket connection`));

  // updates current client only


  socket.on('newMessage', (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback('Profanity is not allowed')
    }
    //updates all clients
    io.to('bobs').emit('newMessage', generateMessage(message));
    callback();
  });

  socket.on('join', ({ username, room }) => {
    socket.join(room);

    socket.emit('joined', generateMessage('Welcome to the chat!'));
    socket.broadcast.to(room).emit('alert', generateMessage(`${username} has joined.`));
  })

  socket.on('sendLocation', (position, callback) => {
    io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${position.lat},${position.long}`));
    callback();
  });

  socket.on('disconnect', () => {
    io.emit('joined', generateMessage(`A user has left`));
  });
});

server.listen(PORT, ()=> {
  console.log(chalk.green.bold(`Server is running on port ${PORT}`));
});