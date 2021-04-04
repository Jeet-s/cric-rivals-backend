const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
var cors = require('cors');
const http = require('http');

const authRoutes = require('./routes/auth');
const socketService = require('./services/socketio');

require('./db/mongoose');
require('./services/passport');

const app = express();

socketService(http.createServer(app))

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.use(passport.initialize());
app.use(passport.session());

app.use(authRoutes);

module.exports = app;