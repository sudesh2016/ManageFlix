'use strict';
var mongoose = require('mongoose');
var Promise = require('bluebird');
Promise.promisifyAll(mongoose);

var showSchema = new mongoose.Schema({
  title: {
    type: String,
    index: true,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  available: {
    type: []
  },
  review: {
    type: String
  },
  watching: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
});

module.exports = mongoose.model('Show', showSchema);
