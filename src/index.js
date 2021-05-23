const app = require("./app");

const port = process.env.PORT || 3000;

const socketService = require("./services/socketio");
const http = require("http");

var server = app.listen(port, () => {
  console.log("listening on :", port);
});

socketService(server);

let Player = require("./models/Player");
let Team = require("./models/Team");
// let mongoose = require("mongoose");

// (async function () {
//   let teams = await Team.updateMany({}, { $unset: { squad: "" } });
// })();
