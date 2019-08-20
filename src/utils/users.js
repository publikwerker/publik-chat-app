const users = [];

const addUser = ({ id, username, room }) => {
  //clean the data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  //validate the data
  if (!room || !username) {
    return {
      error: 'Username and room are required'
    }
  }

  //check for existing user
  const userExists = users.find((user) => {
    return user.room === room && user.username === username
  });

  //validate username
  if (userExists){
    return {
      error: 'Username is in use.'
    }
  }

  //store user
  const user = { id, username, room };
  users.push(user);
  return {
    user
  }
}

//remove user
const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0]
  }
}

//get user
const getUser = (id) => {
  return users.find((user) => user.id === id);
}

//getUsersInRoom
const getRoomies = (room) => {
  room = room.trim().toLowerCase();
  const roomies = users.filter((user) => user.room === room );
  if (!roomies) {
    return {
      error: `${room} is empty.`
    }
  }
  console.log(roomies)
  return {
    roomies
  };
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getRoomies
}