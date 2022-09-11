const io = require("socket.io")(8900, {
  cors: {
    origin:'http://localhost:3000'
  }
})

let users = [];

const addUser = (userId, socketId) => {
  !users.some(user => user.userId === userId) &&
    users.push({userId, socketId});
}

const removeUser = (socketId) => {
  users = users.filter(user => user.socketId !== socketId);
}

const getUser = (userId) => {
  return users.find(user => {
    return user.userId === userId;
  })
}

io.on("connection", (socket) => {
  console.log("a user connected");
  console.log(socket.id);
  // io.emit("welcome", "hello this is socket");
  // io.to(socket.id).emit("another", "Welcome from another planet");
  // take userId and socketId from user.
  socket.on("addUser", userId => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  // send and get message
  socket.on("sendMessage", ({senderId, receiverId, text}) => {
    const user = getUser(receiverId);
    io.to(user.socketId).emit("getMessage", {
      senderId,
      text
    })
  })

  socket.on("disconnect", () => {
    console.log("a user disconnected");
    console.log(socket.id);
    removeUser(socket.id);
    io.emit("getUsers", users);

  });
});

