const server = require('./app');
const PORT = process.env.PORT;
const chalk = require('chalk');
const socketio = require('socket.io');
const io = socketio(server);

let count = 0;

// server (emit) => client (receive) - countUpdated
// client (emit) => server (receive) - increment

io.on('connection', (socket) => {
  console.log(chalk.blue.bold(`New WebSocket connection`));

  socket.emit('countUpdated', count)

  socket.on('increment', () => {
    count++;
    // updates current socket only
    // socket.emit('countUpdated', count);

    //updates all sockets
    io.emit('countUpdated', count);
  })
});

server.listen(PORT, ()=> {
  console.log(chalk.green.bold(`Server is running on port ${PORT}`))
});