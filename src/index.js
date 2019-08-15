const server = require('./app');
const PORT = process.env.PORT;
const chalk = require('chalk');
const socketio = require('socket.io');
const io = socketio(server);
const Filter = require('bad-words');

// server (emit) => client (receive) - joined, newMessage
// client (emit) => server (receive) - newMessage

io.on('connection', (socket) => {
  console.log(chalk.blue.bold(`New WebSocket connection`));

  // updates current client only
  socket.emit('joined', 'Welcome to the chat!');
  socket.broadcast.emit('alert', 'A new user has joined');

  socket.on('newMessage', (message, callback) => {
    const filter = new Filter()

    if (filter.isProfane(message)) {
      return callback('Profanity is not allowed')
    }
    //updates all clients
    io.emit('newMessage', message);
    callback();
  });

  socket.on('sendLocation', (position) => {
    io.emit('message', `https://google.com/maps?q=${position.lat},${position.long}`)
  })

  socket.on('disconnect', () => {
    io.emit('joined', `A user has left`);
  })
});

server.listen(PORT, ()=> {
  console.log(chalk.green.bold(`Server is running on port ${PORT}`))
});