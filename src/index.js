const server = require('./app');
const PORT = process.env.PORT;
const chalk = require('chalk');
const socketio = require('socket.io');
const io = socketio(server);

// server (emit) => client (receive) - joined, newMessage
// client (emit) => server (receive) - newMessage

io.on('connection', (socket) => {
  console.log(chalk.blue.bold(`New WebSocket connection`));

  // updates current client only
  socket.emit('joined', 'Welcome to the chat!');
  socket.broadcast.emit('alert', 'A new user has joined');

  socket.on('newMessage', (message) => {
  
    //updates all clients
    io.emit('newMessage', message);
    console.log(message);
  });

  socket.on('disconnect', () => {
    io.emit('joined', `A user has left`);
  })
});

server.listen(PORT, ()=> {
  console.log(chalk.green.bold(`Server is running on port ${PORT}`))
});