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
}).directive("masonry", function () {
    var NGREPEAT_SOURCE_RE = '<!-- ngRepeat: ((.*) in ((.*?)( track by (.*))?)) -->';
    return {
        compile: function(element, attrs) {
            // auto add animation to brick element
            var animation = attrs.ngAnimate || "'masonry'";
            var $brick = element.children();
            $brick.attr("ng-animate", animation);

            // generate item selector (exclude leaving items)
            var type = $brick.prop('tagName');
            var itemSelector = type+":not([class$='-leave-active'])";

            return function (scope, element, attrs) {
                var options = angular.extend({
                    itemSelector: itemSelector
                }, scope.$eval(attrs.masonry));

                // try to infer model from ngRepeat
                if (!options.model) {
                    var ngRepeatMatch = element.html().match(NGREPEAT_SOURCE_RE);
                    if (ngRepeatMatch) {
                        options.model = ngRepeatMatch[4];
                    }
                }

                // initial animation
                element.addClass('masonry');

                // Wait inside directives to render
                setTimeout(function () {
                    element.masonry(options);

                    element.on("$destroy", function () {
                        element.masonry('destroy')
                    });

                    if (options.model) {
                        scope.$apply(function() {
                            scope.$watchCollection(options.model, function (_new, _old) {
                                if(_new == _old) return;

                                // Wait inside directives to render
                                setTimeout(function () {
                                    element.masonry("reload");
                                });
                            });
                        });
                    }
                },1000);
            };
        }
    };
});
