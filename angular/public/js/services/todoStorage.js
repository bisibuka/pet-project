/*global angular */

/**
 * Services that persists and retrieves todos from localStorage or a backend API
 * if available.
 *
 * They both follow the same API, returning promises for all changes to the
 * model.
 */
angular.module('todomvc')
    .factory('todoStorage', function ($http, $injector) {
        'use strict';

        // Detect if an API backend is present. If so, return the API module, else
        // hand off the localStorage adapter
        return $http.get('/api')
            .then(function () {
                return $injector.get('api');
            }, function () {
                return $injector.get('localStorage');
            });
    })

    .factory('api', function ($resource) {
        'use strict';

        var store = {
            lists: [],

            api_todos: $resource('/api/todos/:id/', null,
                {
                    update: {method: 'PUT'},
                    bulk_delete: {method: 'DELETE', url: 'api/todos/bulk_delete'}
                }
            ),

            api_lists: $resource('/api/lists/:id/', null,
                {
                    query:  {method: 'GET', isArray:false},
                    update: {method: 'PUT'}
                }
            ),

            clearCompleted: function (list) {
                var originalTodos = list.items.slice(0);

                var incompleteTodos = list.items.filter(function (todo) {
                    return !todo.completed;
                });

                var completeTodoIDs = [];
                list.items.forEach(function (todo) {
                    if(todo.completed) completeTodoIDs.push(todo.id);
                });

                angular.copy(incompleteTodos, list.items);

                return store.api_todos.bulk_delete({ids: completeTodoIDs.join(',')}, function () {
                }, function error() {
                    angular.copy(originalTodos, list.items);
                });
            },

            deleteTodo: function (list, todo) {
                var originalTodos = list.items.slice(0);

                list.items.splice(list.items.indexOf(todo), 1);
                return store.api_todos.delete({id: todo.id},
                    function () {
                    }, function error() {
                        angular.copy(originalTodos, list.items);
                    });
            },

            deleteTodoList: function (list) {
                var originalLists = store.lists;

                store.lists.splice(store.lists.indexOf(list), 1);
                return store.api_lists.delete({id: list.id},
                    function () {
                    }, function error() {
                        angular.copy(originalLists, store.lists);
                    });
            },

            get: function () {
                return store.api_lists.query(function (resp) {
                    angular.copy(resp.results, store.lists);
                });
            },

            insertTodo: function (list, todo) {
                var originalTodos = list.items;

                return store.api_todos.save(todo,
                    function success(resp) {
                        todo.id = resp.id;
                        list.items.push(todo);
                    }, function error() {
                        angular.copy(originalTodos, list.items);
                    })
                    .$promise;
            },

            insertTodoList: function(list) {
                var originalLists = store.lists.slice(0);

                return store.api_lists.save(list,
                    function success(resp) {
                        list.id = resp.id;
                        store.lists.unshift(list);
                    }, function error() {
                        angular.copy(originalLists, store.lists);
                    })
                    .$promise;
            },

            putTodo: function (todo) {
                return store.api_todos.update({id: todo.id}, todo)
                    .$promise;
            },

            putTodoList: function (list) {
                return store.api_lists.update({id: list.id}, list)
                    .$promise;
            }
        };

        return store;
    })

    .factory('localStorage', function ($q) {
        'use strict';

        var STORAGE_ID = 'todos-angularjs';

        var store = {
            lists: [],

            _getFromLocalStorage: function () {
                return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
            },

            _saveListsToLocalStorage: function (lists) {
                localStorage.setItem(STORAGE_ID, JSON.stringify(lists));
            },

            _saveToLocalStorage: function (list, todos) {
                var lists = JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');

                lists[lists.indexOf(list)].items = todos;
                localStorage.setItem(STORAGE_ID, JSON.stringify(lists));
            },

            clearCompleted: function (list) {
                var deferred = $q.defer();

                var incompleteTodos = list.items.filter(function (todo) {
                    return !todo.completed;
                });

                angular.copy(incompleteTodos, list.items);

                store._saveToLocalStorage(list, list.items);
                deferred.resolve(list.items);

                return deferred.promise;
            },

            deleteTodo: function (todo, list) {
                var deferred = $q.defer();

                list.items.splice(list.items.indexOf(todo), 1);

                store._saveToLocalStorage(list, list.items);
                deferred.resolve(list.items);

                return deferred.promise;
            },

            deleteTodoList: function (list) {
                var deferred = $q.defer();

                store.lists.splice(store.lists.indexOf(list), 1);

                store._saveListsToLocalStorage(store.lists);
                deferred.resolve(list.items);

                return deferred.promise;
            },

            get: function () {
                var deferred = $q.defer();

                angular.copy(store._getFromLocalStorage(), store.lists);
                deferred.resolve(store.lists);

                return deferred.promise;
            },

            insertTodo: function (list, todo) {
                var deferred = $q.defer();

                list.items.push(todo);

                store._saveToLocalStorage(list, list.items);
                deferred.resolve(list.items);

                return deferred.promise;
            },

            insertTodoList: function(list) {
                var deferred = $q.defer();

                store.lists.push(list);

                store._saveListsToLocalStorage(store.lists);
                deferred.resolve(store.lists);

                return deferred.promise;
            },

            putTodo: function (todo, list) {
                var deferred = $q.defer();

                list.items[list.items.indexOf(todo)] = todo;

                store._saveToLocalStorage(list, list.items);
                deferred.resolve(list.items);

                return deferred.promise;
            },

            putTodoList: function (list) {
                var deferred = $q.defer();

                store.lists[store.lists.indexOf(list)] = list;

                store._saveListsToLocalStorage(store.lists);
                deferred.resolve(store.lists);

                return deferred.promise;
            }
        };

        return store;
    });
