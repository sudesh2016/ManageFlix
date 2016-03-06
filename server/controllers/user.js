'use strict';

var User = require('../models/user');

var errorFunction = function(error, res) {
    console.log(error);
    res.status(400).send({
      data: 'Something went wrong on our end while  trying to  get your data'
    });
};

var getProfile = function(req, res) {
  User.findOneAsync({
      _id: req.user.id
    })
    .then(function(data) {

      res.send({
        user: data
      });

    })
    .catch(function(error) {
      errorFunction(res, error);
    });
};

exports.getProfile = getProfile;
