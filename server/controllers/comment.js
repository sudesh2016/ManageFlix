'use strict';

var Show = require('../models/show');
var User = require('../models/user');
var Comment = require('../models/comment');
var pageLimit = 10;

var errorFunction = function(error, res) {
  var error = error.msg || 'Something went wrong on our end while trying to  get your data';
  res.status(400).send({
    data: error
  });
};

var createComment = function(req, res) {
  var comment = new Comment({
    comment: {
      text: req.body.text,
      creator: req.user._id
    },
    show: req.params.showid
  });
  comment.saveAsync()
    .then(function(data) {
      res.send({
        data: data
      });
    })
    .catch(function(error) {
      errorFunction(error, res);
    });
};

var commentCount = function(req, res) {
  var options = {
    show: req.params.showid
  };

  Comment.countAsync(options)
    .then(function(data){
      res.send({
        data: data
      });
    });
};

var allComments = function(req, res) {
  var options = {
    show: req.params.showid
  };

  if (!req.params.showid) {
    res.status(500).send({
      data: 'Need shoow id'
    });
  }

  Comment.find(options)
    .populate('comment.creator')
    .limit(pageLimit)
    .sort({
      _id: -1
    })
    .lean()
    .execAsync()
    .then(function(data) {
      res.send({
        data: data
      });
    })
    .catch(function(error) {
      errorFunction(error, res);
    });
};

exports.get = allComments;
exports.create = createComment;
