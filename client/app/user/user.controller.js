'use strict';

angular.module('stuffterestApp')
  .controller('UserCtrl', function ($scope, $http, $routeParams, socket) {
    var userId = $routeParams.id;
        $http.get('/api/things/user/' + userId).success(function(awesomeThings) {
          $scope.awesomeThings = awesomeThings;
          socket.syncUpdates('thing', $scope.awesomeThings);
        });
        $http.get('/api/users/' + userId).success(function(user) {
          console.log(user);
          $scope.name = user.name;
        })
  });
