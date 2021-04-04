const socketio = require("socket.io");
module.exports = function socket(server) {
  let io = socketio(server, {
    cors: {
      origin: "http://localhost:8100",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });

    socket.on("create-game", (roomId) => {
      if (!io.sockets.adapter.rooms.has(roomId)) {
        socket.join(roomId);
      } else {
        socket.emit("error", "Room Id not available");
      }
    });

    socket.on("join-game", (roomId) => {
      if (
        io.sockets.adapter.rooms.has(roomId) &&
        io.sockets.adapter.rooms.get(roomId).size == 1
      ) {
        socket.join(roomId);

        io.to(roomId).emit("start-game", roomId);
      } else {
        socket.emit("error", "Room Id not available");
      }
    });

    socket.on("send-score", ({ roomId, score }) => {
      socket.broadcast.to(roomId).emit("update-score", score);
    });
  });
};
