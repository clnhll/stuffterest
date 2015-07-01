'use strict';

angular.module('stuffterestApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/user/:id', {
        templateUrl: 'app/user/user.html',
        controller: 'UserCtrl'
      });
  });
