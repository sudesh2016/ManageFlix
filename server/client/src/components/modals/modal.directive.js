'use strict';

angular.module('Hisbiscus')
  .directive('simplemodal', ['$location', '$rootScope', function($location, $rootScope) {
    return {
      templateUrl: 'components/modals/modals.template.html',
      link: function(scope, element, attrs) {
        // I define which modal window is being rendered. By convention,
        // the subview will be the same as the type emitted by the modals
        // service object.
        scope.subview = null;
        // If the user clicks directly on the backdrop (ie, the modals
        // container), consider that an escape out of the modal, and reject
        // it implicitly.
        element.on(
          'click',
          function handleClickEvent(event) {
            if (element[0] !== event.target) {
              return;
            }

            scope.$apply(modals.reject);
          }
        );
        // Listen for "open" events emitted by the modals service object.
        $rootScope.$on(
          'modals.open',
          function handleModalOpenEvent(event, modalType) {
            scope.subview = modalType;
            var element = angular.element(document).find('body');
            element.addClass('lock-body');
          }
        );
        // Listen for "close" events emitted by the modals service object.
        $rootScope.$on(
          'modals.close',
          function handleModalCloseEvent(event) {
            var element = angular.element(document).find('body');
            element.removeClass('lock-body');
            scope.subview = null;
          }
        );
      }
    };
  }]);
