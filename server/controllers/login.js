'use strict';

var User = require('../models/user');
var bcrypt = require('bcryptjs');
var jwt = require('jwt-simple');
var moment = require('moment');
var Promise = require('bluebird');
Promise.promisifyAll(bcrypt);
var config = require('../config');

var errorFunction = function(res, error) {
  console.log(error);
  res.status(400).send({
    data: 'Something went wrong on our end while  trying to  get your data'
  });
};

var createToken = function(user) {
  var payload = {
    exp: moment().add(14, 'days').unix(),
    iat: moment().unix(),
    sub: user._id
  };

  return jwt.encode(payload, config.tokenSecret);
};

var signup = function(req, res) {
  var user;

  User.findOneAsync({
      username: req.body.username
    })
    .then(function(existingUser) {
      if (existingUser) {
        throw ('username exists');
      }
      user = new User({
        password: req.body.password,
        username: req.body.username
      });
      return bcrypt.genSaltAsync(10);
    })
    .then(function(salt) {
      return bcrypt.hashAsync(user.password, salt);
    })
    .then(function(hash) {
      user.password = hash;
      return user.saveAsync();
    })
    .then(function(user) {
      var token = createToken(user);
      var newUser = {
        username: user.username,
        _id: user._id,
        shows: user.shows
      };
      res.send({
        token: token,
        user: newUser
      });
    })
    .catch(function(error) {
      errorFunction(res, error);
    });
};

var login = function(req, res) {
  var user;
  User.findOneAsync({
      username: req.body.username
    }, '+password')
    .then(function(data) {
      if (!data) {
        throw ('Incorrect Email Or Password');
      }
      user = data;
      return bcrypt.compareAsync(req.body.password, user.password);
    })
    .then(function(isMatch) {
      if (!isMatch) {
        throw ('Incorrect Email Or Password');
      } else {
        user = user.toObject();
        delete user.password;

        var token = createToken(user);
        res.send({
          token: token,
          user: user
        });
      }
    })
    .catch(function(error) {
      errorFunction(res, error);
    });

};


var isAuthenticated = function(req, res, next) {
  if (!(req.headers && req.headers.authorization)) {
    return res.status(400).send({
      message: 'You did not provide a JSON Web Token in the Authorization header.'
    });
  }

  var header = req.headers.authorization.split(' ');
  var token = header[1];
  var payload = jwt.decode(token, config.tokenSecret);
  var now = moment().unix();
  if (now > payload.exp) {
    return res.status(401).send({
      message: 'Token has expired.'
    });
  }

  User.findByIdAsync(payload.sub)
    .then(function(user) {
      if (!user) {
        return res.status(400).send({
          message: 'User no longer exists.'
        });
      }

      req.user = user;
      next();
    })
    .catch(function(error) {
      errorFunction(res, error);
    });

};

exports.isAuthenticated = isAuthenticated;
exports.login = login;
exports.signup = signup;
