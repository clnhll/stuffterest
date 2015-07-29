'use strict';

angular.module('stuffterestApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/all', {
        templateUrl: 'app/all/all.html',
        controller: 'AllCtrl',
        //authenticate: true
      });
  });
