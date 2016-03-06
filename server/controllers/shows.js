'use strict';

var Show = require('../models/show');
var User = require('../models/user');
var _ = require('lodash');
var Promise = require('bluebird');
var Comment = require('../models/comment');
var pageLimit = 10;


var errorFunction = function(error, res) {
  var error = error.msg || 'Something went wrong on our end while trying to  get your data';
  res.status(400).send({
    data: error
  });
};

var createShow = function(req, res) {

  var show = new Show({
    title: req.body.title,
    description: req.body.description,
    available: req.body.available,
    image: req.body.image,
    creator: req.user._id
  });

  show.saveAsync()
    .then(function(data) {
      res.send({
        data: data
      });
    })
    .catch(function(error) {
      errorFunction(error, res);
    });

};

var remove = function(req, res) {
  Show.updateAsync({
      _id: req.body.showid
    }, {
      $pull: {
        watching: req.user._id
      }
    })
    .then(function(data) {
      return User.updateAsync({
        _id: req.user._id
      }, {
        $pull: {
          shows: req.body.showid
        }
      });
    })
    .then(function(data) {
      res.send({
        data: 'removed'
      });
    })
    .catch(function(error) {
      res.status(500).send({
        error: 'Error occured while updating'
      });
    });
};

var watch = function(req, res) {
  var customError = {};
  Show.find()
    .and([{
      _id: req.body.showid
    }, {
      watching: req.user._id
    }])
    .execAsync()
    .spread(function(show) {
      var result;
      if (!show) {
        result = Show.updateAsync({
          _id: req.body.showid
        }, {
          $addToSet: {
            watching: req.user._id
          }
        });
      } else {
        customError.msg = 'Already watching';
        throw (customError);
      }
      return result;
    })
    .then(function(show) {
      if (!show) {
        customError.msg = 'No show with that ID';
        throw (customError);
      }
      return User.updateAsync({
        _id: req.user._id
      }, {
        $addToSet: {
          shows: req.body.showid
        }
      });
    })
    .then(function(data) {
      res.status(200).send({
        data: 'ok'
      });
    })
    .catch(function(error) {
      if (!error.msg) {
        customError = error;
      }
      errorFunction(customError, res);
    });
};

var myShows = function(req, res) {
  Show.findAsync({
      watching: req.user._id
    })
    .then(function(data) {
      res.send({
        data: data
      });
    })
    .catch(function(error) {
      errorFunction(error, res);
    });
};

var allShows = function(req, res) {
  var shows;
  var ids;
  var options = {
    // watching: {
    //   $ne: req.user._id
    // }
  };

  if (req.query.id) {
    options._id = {
      $gt: req.query.id
    };
  }

  Show.find(options)
    .limit(pageLimit)
    .sort({
      _id: 1
    })
    .lean()
    .execAsync()
    .then(function(data) {
      var promises = [];
      shows = data;
      ids = _.map(data, '_id');
      for(var i = 0 ; i < ids.length; i++) {
        promises.push(Comment.countAsync({show: ids[i]}));
      }
      return Promise.all(promises);
    })
    .then(function(data){
       var sendShow;
       var i = 0;
      _.forEach(shows, function(show){
        if(show._id === ids[i]) {
          show.comments = data[i];
        }
        show.peoplewatching = show.watching.length;
        delete show.watching;
        i++;
      });
      res.send({
        data: shows
      });
    })
    .catch(function(error) {
      errorFunction(error, res);
    });
};

exports.remove = remove;
exports.watch = watch;
exports.get = allShows;
exports.create = createShow;
exports.myshows = myShows;
