'use strict';

angular.module('Hisbiscus')
  .controller('FeedCtrl', ['$scope', '$location',
    'apiservice', 'modals', 'util', 'urls', '$rootScope',
    function($scope, location, api, modals, util, urls, root) {
      $scope.getComments = function(index) {

        var data = {
          index: index
        };

        var promise = modals.open('comment', data);

        promise.then(
          function handleResolve(response) {
          },
          function handleReject(error) {
          }
        );
      };

      //TODO Bad add to directive later
      $scope.addToWatch = function(index) {
        var elementID = util.Stringformat('watch{0}', index);
        var className = document.getElementById(elementID).className;
        var apiRequest;
        var removeClass;
        var addClass;


        className = className.split(' ');

        if (className.includes('watch')) {
          apiRequest = 'addToWatch';
          addClass = 'watch__on__click';
          removeClass = 'watch';
        } else {
          apiRequest = 'removeFromWatch';
          addClass = 'watch';
          removeClass = 'watch__on__click';
        }

        api[apiRequest]($scope.shows[index]._id)
          .then(function() {
            angular.element(document.getElementById(elementID)).addClass(addClass);
            angular.element(document.getElementById(elementID)).removeClass(removeClass);
            // add the user
            if(apiRequest === 'addToWatch') {
              $scope.shows[index].peoplewatching ++;
            } else if (apiRequest === 'removeFromWatch'){
              $scope.shows[index].peoplewatching --;
            }

          })
          .catch(function(error) {
            console.error('error', error);
          });
      };

      var getShows = function() {
        var allShows;
        api.getShows()
          .then(function(shows) {
            allShows = shows.data.data;
            return api.getProfile();
          })
          .then(function(data) {
            var myshows = data.data.user.shows;
            // Highlight my show
            _.forEach(allShows, function(value, key) {
              if(value.available.length > 0) {
                value.availableDisplay = [];
                for(var i = 0 ; i < value.available.length; i++) {
                  value.availableDisplay.push(urls.available[value.available[i]]);
                }
              }
              value.imgsrc = urls.shows.image + value.image;
              if (_.indexOf(myshows, value._id) !== -1) {
                allShows[key].myshow = true;
              }
            });
            $scope.shows = allShows;

          });
      };

      getShows();

    }
  ]);
