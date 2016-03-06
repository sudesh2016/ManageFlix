'use strict';

angular.module('Hisbiscus')
  .controller('NavCtrl', ['$scope', '$location', '$window',
    '$route', 'apiservice', '$rootScope', 'modals', 'urls',
    function($scope, $location, $window, route, api, root, modals, urls) {

      $scope.ddSelectOptions = [{
        text: 'Logout',
        value: 'logout'
      }];

      $scope.ddSelectSelected = {}; // Must be an object
      var loggedIn = function() {
        if (api.loggedIn()) {
          $scope.loggedIn = true;
          $scope.username = root.currentUser.username;
          if (root.currentUser.profile_pic) {
            $scope.img = urls.profilePicture.get + root.currentUser.profile_pic;
          } else {
            $scope.img = urls.profilePicture.default;
          }

        } else {
          $scope.loggedIn = false;
          root.currentUser = '';
          $scope.img = '';
        }
      };

      $scope.getShows = function() {
        var promise = modals.open(
          'shows', {
            message: 'file',
            placeholder: 'place holder'
          }
        );
        promise.then(
          function handleResolve(response) {
            console.log('recieved', response);
          },
          function handleReject(error) {
            console.warn('reject');
          }
        );
      };

      $scope.$on('login::sucess', function() {
        loggedIn();
      });

      $scope.logout = function() {
        if (!api.loggedIn()) {
          return;
        }
        api.logout()
          .then(function() {
            delete $window.localStorage.currentUser;
            loggedIn();
            $location.path('/login');
          });
      };

      loggedIn();

    }
  ]);
