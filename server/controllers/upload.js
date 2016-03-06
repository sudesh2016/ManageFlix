'use strict';
var multer = require('multer');
var uuid = require('node-uuid');
var Promise = require('bluebird');
var User = require('../models/user');


var storage = multer.diskStorage({ //multers disk storage settings
  destination: function(req, file, cb) {
    cb(null, './server/uploads/');
  },
  filename: function(req, file, cb) {
    var myfilename = uuid.v4();
    cb(null, myfilename + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
  }
});


var upload = multer({
  storage: storage
}).single('file');


var profilePicture = function(req, res) {

  // req.user gets overwritten by Multer
  var userObj = req.user;

  upload(req, res, function(err, data) {
    if (err) {
      res.json({
        error_code: 1,
        err_desc: err
      });
      return;
    }
    var query = {
      _id: userObj.id
    };
    User.updateAsync(query, {
        $set: {
          profile_pic: req.file.filename
        }
      })
      .then(function(data) {
        res.json({
          msg: 'New Profile Pic updated'
        });
      })
      .catch(function(eror) {
        res.status(500).send({
          error: 'Something happened while updating picture'
        });
      });
  });
};


exports.profilePicture = profilePicture;
