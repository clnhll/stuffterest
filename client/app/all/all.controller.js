'use strict';

angular.module('stuffterestApp')
  .controller('AllCtrl', function ($scope, $http, socket, Auth) {
    $scope.awesomeThings = [];
    $scope.isLoggedInAsync = Auth.isLoggedInAsync;

    $scope.isLoggedInAsync(function(loggedIn){
      if (loggedIn) {
        $http.get('/api/things/').success(function(awesomeThings) {
          $scope.awesomeThings = awesomeThings;
          socket.syncUpdates('thing', $scope.awesomeThings);
        });
      }
    })

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
  }).directive('errSrc', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        if (attrs.src != attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });
    }
  }
});
