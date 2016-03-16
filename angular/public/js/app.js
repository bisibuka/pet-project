/*global angular */

/**
 * The main TodoMVC app module
 *
 * @type {angular.Module}
 */
angular.module('todomvc', ['ngRoute', 'ngResource'])
    .config(function ($routeProvider) {
        'use strict';

        var routeConfig = {
            controller : 'TodoCtrl',
            templateUrl: 'todomvc-index.html',
            resolve    : {
                store: function (todoStorage) {
                    // Get the correct module (API or localStorage).
                    return todoStorage.then(function (module) {
                        module.get(); // Fetch the todo records in the background.
                        return module;
                    });
                }
            }
        };

        $routeProvider
            .when('/', routeConfig)
            .when('/:status', routeConfig)
            .otherwise({
                redirectTo: '/'
            });
    });

angular.module('todomvc')
    .config(function($resourceProvider) {
        $resourceProvider.defaults.stripTrailingSlashes = false;
    });

angular.module('todomvc')
    .config(function($httpProvider) {
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    });
