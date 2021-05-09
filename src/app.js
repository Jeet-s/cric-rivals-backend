const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
var cors = require("cors");

const authRoutes = require("./routes/auth");
const teamRoutes = require("./routes/team");

require("./db/mongoose");
require("./services/passport");

const app = express();

app.set("view engine", "ejs");

app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json"
  );
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

app.use(authRoutes);
app.use("/api", teamRoutes);

module.exports = app;
