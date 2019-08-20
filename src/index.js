const server = require('./app');
const PORT = process.env.PORT;
const chalk = require('chalk');
const socketio = require('socket.io');
const io = socketio(server);
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages');
const { 
  addUser,
  removeUser,
  getUser,
  getRoomies
 } = require('./utils/users');
 const Admin = 'werkBot';

// server (emit) => client (receive) - joined, newMessage
// client (emit) => server (receive) - newMessage

io.on('connection', (socket) => {
  console.log(chalk.blue.bold(`New WebSocket connection`));

  socket.on('newMessage', (message, callback) => {
    const filter = new Filter();
    const user = getUser(socket.id);

    if (filter.isProfane(message.text)) {
      return callback('Profanity is not allowed')
    }
    //updates all clients
    io.to(user.room).emit('newMessage', generateMessage(user.username, message));
    callback();
  });

  socket.on('join', ({ username, room }, callback) => {
    const { error, user} = addUser({ id: socket.id, username, room})

    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    socket.emit('joined', generateMessage(Admin, `Welcome to the chat, ${user.username}!`));
    socket.broadcast.to(user.room).emit('alert', generateMessage(Admin, `${user.username} has joined.`));
    callback();
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getRoomies(user.room)
    })
  })

  socket.on('sendLocation', (position, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${position.lat},${position.long}`));
    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('joined', generateMessage(Admin, `${user.username} has left`));
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getRoomies(user.room)
      })
    }
  });
});

server.listen(PORT, ()=> {
  console.log(chalk.green.bold(`Server is running on port ${PORT}`));
});