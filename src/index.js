const server = require('./app');
const PORT = process.env.PORT;
const chalk = require('chalk');
const socketio = require('socket.io');
const io = socketio(server);

// server (emit) => client (receive) - joined, newMessage
// client (emit) => server (receive) - newMessage

io.on('connection', (socket) => {
  console.log(chalk.blue.bold(`New WebSocket connection`));

  // updates current socket only
  socket.emit('joined', 'Welcome to the chat!');
  socket.on('newMessage', (message) => {
  
    //updates all sockets
    io.emit('newMessage', message);
    console.log(message);
  });
});

server.listen(PORT, ()=> {
  console.log(chalk.green.bold(`Server is running on port ${PORT}`))
});