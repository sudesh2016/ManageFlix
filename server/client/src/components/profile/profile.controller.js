'use strict';

angular.module('Hisbiscus')
  .controller('ProfileCtrl', ['$scope', 'apiservice',
    'events', 'modals', '$rootScope', 'urls', 'util', '$window',
    function($scope, api, EVENT, modals, root, url, util, $window) {

      $scope.upload = function(data) {
        if (data) {
          var readFile = data;
          var reader = new FileReader();

          reader.readAsDataURL(readFile);
          reader.onload = function(readFile) {

            $scope.$apply(function() {
              var file = {
                  imgData: reader.result,
                  file: data
                };
                // The .open() method returns a promise that will be either
                // resolved or rejected when the modal window is closed.
              var promise = modals.open(
                'prompt', {
                  message: file,
                  placeholder: 'holder'
                }
              );
              promise.then(
                function handleResolve(response) {
                  api.getProfile()
                    .then(function(profile) {
                      $window.localStorage.currentUser = JSON.stringify(profile.data.user);
                      root.currentUser = JSON.parse($window.localStorage.currentUser);
                      $scope.$parent.img = util.Stringformat('{0}/{1}', url.profilePicture.get, profile.data.user.profile_pic);
                    });
                  console.log('resolved', response);
                },
                function handleReject(error) {
                  console.warn('reject');
                }
              );
            });

          };
        }

      };

    }
  ]);
