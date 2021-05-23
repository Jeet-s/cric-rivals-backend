const socketio = require("socket.io");
module.exports = function socket(server) {
  let io = socketio(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true,
    },
  });

  let users = [];

  io.on("connection", (socket) => {
    console.log(socket.handshake.query);
    var userId = socket.handshake.query.userId;
    let userRoom = users.find(
      (x) => x.userId == userId || x.opponentId == userId
    );
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
        users.findIndex((x) => x.userId == userId && x.roomId == data.roomId) ==
          -1
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
        users.findIndex(
          (x) => x.opponentId == userId && x.roomId == data.roomId
        ) == -1
      ) {
        socket.join(data.roomId);
        console.log("join", data.roomId);

        let user = { socketId: socket.id, ...data };
        users.push(user);

        let startData = {
          roomId: data.roomId,
          userId: users.find((x) => x.roomId == data.roomId && x.userId).userId,
          opponentId: data.opponentId,
        };

        console.log("STRAT DTAA", startData);

        io.to(data.roomId).emit("start-game", startData);
      } else {
        console.log(" error join", data.roomId);
        socket.emit("error", "Room Id not available");
      }
    });

    socket.on("send-score", ({ roomId, score }) => {
      console.log("send scrore ", roomId, score);
      socket.broadcast.to(roomId).emit("update-score", score);
    });

    socket.on("match-over", ({ roomId }) => {
      console.log("match-over", roomId);
      users = users.filter((u) => u.roomId != roomId);
      io.sockets.adapter.rooms[roomId]?.forEach(function (s) {
        s.leave(roomId);
      });
    });
  });
};
