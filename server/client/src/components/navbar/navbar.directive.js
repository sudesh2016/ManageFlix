'use strict';

angular.module('Hisbiscus')
  .directive('navbar', ['$location', '$timeout', function($location, $timeout) {
    return {
      templateUrl: 'components/navbar/navbar.template.html',
      controller: 'NavCtrl', //Embed a custom controller in the directive
      link: function($scope, ele, attrs) {
          var element;
          $scope.goto = function(selected) {
            if(element){
              //element.removeClass('active');
            }
            element = angular.element(document.querySelector('#' + selected));
            //selectActive(selected);
            $location.path(selected);
          };

          var selectActive = function(selected) {
            element = angular.element(document.querySelector('#' + selected));
            //element.addClass('active');
          };

          // Let DOM Load
          $timeout(function () {
            var location = $location.url();

            // Assuming this only be on the 1st index of the array
            var selected = location.split('/')[1];
            selectActive(selected);
          });

        } //DOM manipulation
    };
  }]);
