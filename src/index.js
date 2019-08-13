const server = require('./app');
const PORT = process.env.PORT;
const chalk = require('chalk');
const socketio = require('socket.io');
const io = socketio(server);

io.on('connection', () => {
  console.log(chalk.blue.bold(`New WebSocket connection`))
});

server.listen(PORT, ()=> {
  console.log(chalk.green.bold(`Server is running on port ${PORT}`))
});