const socketio = require("socket.io");
module.exports = function socket(server) {
  let io = socketio(server, {
    cors: {
      origin: "http://localhost",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true,
    },
  });

  let users = [];

  io.on("connection", (socket) => {
    console.log(socket.handshake.query);
    var userId = socket.handshake.query.userId;
    let userRoom = users.find((x) => x.userId == userId);
    if (userRoom) {
      socket.join(userRoom.roomId);
      userRoom.socketId = socket.id;
    }

    console.log("user connected");
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });

    socket.on("create-game", (data) => {
      if (
        !io.sockets.adapter.rooms.has(data.roomId) &&
        users.findIndex((x) => x.userId == userId) == -1
      ) {
        console.log("create", data.roomId);
        socket.join(data.roomId);
        users.push({ socketId: socket.id, ...data });
      } else {
        console.log("error create", data.roomId);
        socket.emit("error", "Room Id not available");
      }
    });

    socket.on("join-game", (data) => {
      if (
        io.sockets.adapter.rooms.has(data.roomId) &&
        io.sockets.adapter.rooms.get(data.roomId).size == 1 &&
        users.findIndex((x) => x.userId == userId) == -1
      ) {
        socket.join(data.roomId);
        console.log("join", data.roomId);
        let user = { socketId: socket.id, ...data };
        io.to(data.roomId).emit("start-game", data);
      } else {
        console.log(" error join", data.roomId);
        socket.emit("error", "Room Id not available");
      }
    });

    socket.on("send-score", ({ roomId, score }) => {
      console.log("send scrore ", roomId, score);
      socket.broadcast.to(roomId).emit("update-score", score);
    });
  });
};

// rejoin room when user disconnects and reconnects
