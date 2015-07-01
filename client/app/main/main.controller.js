'use strict';

angular.module('stuffterestApp')
  .controller('MainCtrl', function ($scope, $http, socket, Auth) {
    $scope.awesomeThings = [];
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.isLoggedInAsync = Auth.isLoggedInAsync;

    $scope.isLoggedInAsync(function(loggedIn){
      if (loggedIn) {
        $http.get('/api/things/user/' + $scope.getCurrentUser()._id).success(function(awesomeThings) {
          $scope.awesomeThings = awesomeThings;
          socket.syncUpdates('thing', $scope.awesomeThings);
          $scope.userId = $scope.getCurrentUser()._id;
        });
      }
    })

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      var now = new Date();
      $http.post('/api/things',
      { name: $scope.newThing,
        owner: $scope.getCurrentUser()._id,
        created: now.getTime(),
      });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

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
