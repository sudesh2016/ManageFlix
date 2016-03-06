'use strict';
angular.module('Hisbiscus')
  .service('apiservice', ['$http', 'urls', 'Upload', '$auth', function(http, urls, Upload, $auth) {
    this.getShows = function() {
      return http.get(urls.shows.get);
    };

    this.postShow = function(data) {
      return http.post(urls.shows.post, data);
    };

    this.upload = function(file) {
      return Upload.upload({
        url: urls.upload.profilePicture,
        data: {
          file: file
        }
      });
    };

    this.removeFromWatch = function(data) {
      return http.post(urls.shows.remove, {showid: data});
    };

    this.addToWatch = function(data){
      return http.post(urls.shows.watch, {showid: data});
    };

    this.myshows = function() {
      return http.get(urls.shows.myshows);
    };

    this.login = function(data) {
      // returns a promise
      return $auth.login({
        username: data.username,
        password: data.password
      });
    };

    this.getComments = function(showID) {
      return http.get(urls.comment.get + showID);
    };

    this.postComment = function(showID, comment) {
      return http.post(urls.comment.post +  showID, {text: comment});
    };

    this.getProfile = function() {
      return http.get(urls.user.get);
    };

    // returns a promise
    this.logout = function() {
      return $auth.logout();
    };

    // Returns a bool value
    this.loggedIn = function() {
      return $auth.isAuthenticated();
    };

    // Returns a bool value
    this.signup = function(data) {
      // returns a promise
      return $auth.signup({
        username: data.username,
        password: data.password
      });
    };

  }]);
