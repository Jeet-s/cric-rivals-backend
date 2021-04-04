const app = require("./app");

const port = process.env.PORT || 3000;

const socketService = require("./services/socketio");
const http = require("http");
// app.get("*", (req, res) => {
//   res.render("error", {
//     title: "404",
//     errorMessage: "Page not found.",
//   });
// });

console.log("port=>", port);

var server = http.createServer(app).listen(port, () => {
  console.log("listening on *:3000");
});

socketService(server);
