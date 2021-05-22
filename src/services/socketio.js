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
      console.log("Before Create ============>>>>>>", users);

      if (
        !io.sockets.adapter.rooms.has(data.roomId) &&
        users.findIndex((x) => x.userId == userId && x.roomId == data.roomId) ==
          -1
      ) {
        console.log("create", data.roomId);
        socket.join(data.roomId);
        users.push({ socketId: socket.id, ...data });
        console.log("After Create ============>>>>>>", users);

        console.log("join GAME DATA=>", { socketId: socket.id, ...data });
      } else {
        console.log("error create", data.roomId);
        socket.emit("error", "Room Id not available");
      }
    });

    socket.on("join-game", (data) => {
      console.log("Before Join ============>>>>>>", users);
      console.log(
        io.sockets.adapter.rooms.has(data.roomId),
        io.sockets.adapter.rooms.get(data.roomId).size == 1,
        users.findIndex(
          (x) => x.opponentId == userId && x.roomId == data.roomId
        ) == -1
      );
      console.log(
        users.findIndex(
          (x) => x.opponentId == userId && x.roomId == data.roomId
        )
      );
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

        console.log("join GAME DATA=>", user);

        let startData = {
          roomId: data.roomId,
          userId: users.find(
            (x) => x.userId == userId && x.roomId == data.roomId
          ),
          opponentId: data.opponentId,
        };

        console.log("START GAME DATA=>", startData);
        console.log("After Join ============>>>>>>", users);

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
  });
};
