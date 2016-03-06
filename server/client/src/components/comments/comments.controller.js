'use strict';

angular.module('Hisbiscus')
  .controller('CommentCtrl', ['$scope', 'modals', 'apiservice',
    function($scope, modals, api) {

      var params = modals.params();
      $scope.showToComment = $scope.shows[params.index];

      $scope.close = function() {
        modals.resolve();
      };

      api.getComments($scope.showToComment._id)
        .then(function(comments) {
          $scope.comments = comments.data.data;
        });

      // TODO move this to directive
      $scope.edit = function(index) {

        var element = document.getElementById('editComment' + index);
        element.setAttribute('contentEditable', true);
        angular.element(element).addClass('edit__text');
        $scope.editON = true;
      };

      // TODO move this to directive
      $scope.save = function(index) {
        var comment = createComment(document.getElementById('editComment' + index).innerHTML);
        $scope.comments[index].comment.text = document.getElementById('editComment' + index).innerHTML;

        var element = document.getElementById('editComment' + index);
        element.setAttribute('contentEditable', false);
        angular.element(element).removeClass('edit__text');
        $scope.editON = false;
      };

      // TODO move this to directive
      $scope.removeInnerText = function(id) {
        var getId = id || 'plainText';
        var element = document.getElementById(getId);
        element.innerHTML = '';
      };

      // TODO move this to directive
      $scope.post = function() {
        var comment = createComment(document.getElementById('plainText').textContent);
        api.postComment($scope.showToComment._id, comment.comment.text)
          .then(function() {
            comment.comment.creator = {};
            comment.comment.creator.username = $scope.username;
            $scope.comments.unshift(comment);
            $scope.shows[params.index].comments ++;
            document.getElementById('plainText').innerHTML = '';
          });
      };

      var createComment = function(text) {
        var comments = {
          comment: {
            text: text
          },
          show: $scope.showToComment._id
        };
        return comments;
      };

    }
  ]);
