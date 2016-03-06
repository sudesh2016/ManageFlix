'use strict';
var mongoose = require('mongoose');
var Promise = require('bluebird');
Promise.promisifyAll(mongoose);

var commentSchema = new mongoose.Schema({
  comment: {
      text: String,
      creator: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
      }
  },
  show: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Show'
  }
});

module.exports = mongoose.model('Comment', commentSchema);
