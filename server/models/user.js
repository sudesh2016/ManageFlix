'use strict';
var mongoose = require('mongoose');
var Promise = require('bluebird');
Promise.promisifyAll(mongoose);

var userSchema = new mongoose.Schema({
  instagramId: {
    type: String,
    index: true
  },
  password: {
    type: String,
    select: false
  },
  shows: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Show'
  }],
  username: {
    type: String
  },
  profile_pic: {
    type: String
  },
  accessToken: String
});

module.exports = mongoose.model('User', userSchema);
