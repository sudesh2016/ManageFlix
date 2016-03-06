'use strict';

angular.module('Hisbiscus')
  .controller('ShowsCtrl', ['$scope', 'apiservice', 'modals', 'urls', function($scope, api, modals, urls) {
    console.log('hello');
    var myshows = function() {
      api.myshows()
        .then(function(myshowsdata) {
        var myshows = myshowsdata.data.data
          _.forEach(myshows, function(value, key) {
            if(value.available.length > 0) {
              value.availableDisplay = [];
              for(var i = 0 ; i < value.available.length; i++) {
                value.availableDisplay.push(urls.available[value.available[i]]);
              }
            }
            value.imgsrc = urls.shows.image + value.image;
            if (_.indexOf(myshows, value._id) !== -1) {
              myshows[key].myshow = true;
            }
          });
          console.log(myshows)
          $scope.myshows = myshows;
        });
    };

    $scope.close = function() {
      modals.resolve();
    };

    myshows();

  }]);
