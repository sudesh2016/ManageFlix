'use strict';

angular.module('Hisbiscus', ['ngAnimate', 'ngRoute', 'satellizer', 'ngDropdowns', 'ngFileUpload'])
  .config(function($routeProvider, $authProvider) {
    $routeProvider
      .when('/feed', {
        templateUrl: 'components/feed/feed.html',
        controller: 'FeedCtrl'
      })
      .when('/landing', {
        templateUrl: 'components/landing/landing.html'
      })
      .when('/signup', {
        templateUrl: 'components/login/signup.html',
        controller: 'LoginCtrl'
      })
      .when('/shows', {
        templateUrl: 'components/shows/shows.html',
        controller: 'ShowsCtrl'
      })
      .when('/login', {
        templateUrl: 'components/login/login.html',
        controller: 'LoginCtrl'
      })
      .when('/comments/:id', {
        templateUrl: 'components/comments/comments.html',
        controller: 'CommentCtrl'
      })
      .otherwise('/feed');

      $authProvider.loginUrl = 'http://localhost:8080/auth/login';
      $authProvider.signupUrl = 'http://localhost:8080/auth/signup';

  })
  .run(function($rootScope, $window, $auth, $location) {
    if ($auth.isAuthenticated()) {
      $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
    } else {
      $location.path('/landing');
    }
  });
