'use strict';

angular.module('Hisbiscus')
  .controller('LoginCtrl', ['$scope', '$window', '$location', '$rootScope', 'apiservice', '$auth',
    function($scope, $window, $location, $rootScope, api, $auth) {
      $scope.login = function() {
        var data = {
          username: $scope.username,
          password: $scope.password
        };
        api.login(data)
          .then(function(response) {
            $window.localStorage.currentUser = JSON.stringify(response.data.user);
            $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
            $scope.$emit('login::sucess');
            $location.path('#/feed');
          })
          .catch(function(response) {
            console.log(response, 'log in error');
          });
      };

      $scope.signup = function() {
        var data = {
          username: $scope.username,
          password: $scope.password
        };
        api.signup(data)
          .then(function(response) {
            $auth.setToken(response);
            $window.localStorage.currentUser = JSON.stringify(response.data.user);
            $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
            $scope.$emit('login::sucess');
            $location.path('#/feed');
          })
          .catch(function(response) {
            console.log(response, 'log in error');
          });
      };


    }
  ]);
