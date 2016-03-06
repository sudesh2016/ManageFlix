'use strict';

var bodyParser = require('body-parser');
var cors = require('cors');
var express = require('express');
var mongoose = require('mongoose');
var Promise = require('bluebird');
var path = require('path');
var compress = require('compression');
var config = require('./config');

var app = express();

Promise.promisifyAll(mongoose);


// Controllers
var loginController = require('./controllers/login');
var showsController = require('./controllers/shows');
var uploadController = require('./controllers/upload');
var userController = require('./controllers/user');
var commentController = require('./controllers/comment');

mongoose.connectAsync(config.db)
  .then(function() {
    console.log('Connected to MongoDB');
  })
  .catch(function(error) {
    console.log('Connection Error');
  });

console.log(config);
app.use(compress());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use('/', express.static(path.join(__dirname, config.staticFiles)));

app.use('/uploads', express.static(path.join(__dirname, config.uploads)));

app.post('/auth/login', loginController.login);
app.post('/auth/signup', loginController.signup);

app.post('/shows/', loginController.isAuthenticated, showsController.create);
app.post('/shows/watch', loginController.isAuthenticated, showsController.watch);
app.post('/shows/remove', loginController.isAuthenticated, showsController.remove);

app.get('/shows/', loginController.isAuthenticated, showsController.get);
app.get('/shows/myshows', loginController.isAuthenticated, showsController.myshows);

app.get('/comment/:showid', loginController.isAuthenticated, commentController.get);
app.post('/comment/:showid', loginController.isAuthenticated, commentController.create);

app.get('/getprofile', loginController.isAuthenticated, userController.getProfile);

app.post('/upload', loginController.isAuthenticated, uploadController.profilePicture);

app.listen(config.port, config.server, function() {
  console.log('Express server listening on port ' + config.port);
});
