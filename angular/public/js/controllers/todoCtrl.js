/*global angular */

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */
angular.module('todomvc')
    .controller('TodoCtrl', function TodoCtrl($scope, $routeParams, $filter, store) {
        'use strict';

        var todolists = $scope.todolists = store.lists;

        $scope.newTodo = {};
        $scope.newTodoList = '';
        $scope.editedTodo = null;
        $scope.editedTodoList = null;
        $scope.remainingCount = {};
        $scope.completedCount = {};
        $scope.allChecked = {};
        $scope.status = {};
        $scope.statusFilter = {};

        todolists.forEach(function(list) {
            $scope.statusFilter[list.id] = {};
        });

        $scope.$watch('todolists', function () {
            todolists.forEach(function(list) {
                $scope.remainingCount[list.id] = $filter('filter')(list.items, {completed: false}).length;
                $scope.completedCount[list.id] = list.items.length - $scope.remainingCount[list.id];
                $scope.allChecked[list.id] = !$scope.remainingCount[list.id];
                $scope.status[list.id] = '';
            });
        }, true);

        $scope.addTodoList = function() {
            var newList = {
                name: $scope.newTodoList.trim(),
                items: []
            };

            if (!newList.name) {
                return;
            }

            $scope.saving = true;
            store.insertTodoList(newList)
                .then(function success() {
                    $scope.newTodoList = '';
                })
                .finally(function () {
                    $scope.saving = false;
                });
        };

        $scope.addTodo = function (list) {
            if(!Object.keys($scope.newTodo).length) return;

            var newTodo = {
                title: $scope.newTodo[list.id].trim(),
                list: list.id,
                completed: false
            };

            if (!newTodo.title) return;

            $scope.saving = true;
            store.insertTodo(list, newTodo)
                .then(function success() {
                    $scope.newTodo = {};
                })
                .finally(function () {
                    $scope.saving = false;
                });
        };

        $scope.editTodoList = function(list) {
            $scope.editedTodoList = list;
            $scope.originalTodoList = angular.extend({}, list);
        };


        $scope.editTodo = function (todo) {
            $scope.editedTodo = todo;
            // Clone the original todo to restore it on demand.
            $scope.originalTodo = angular.extend({}, todo);
        };

        $scope.saveEdits = function (todo, event, list) {
            // Blur events are automatically triggered after the form submit event.
            // This does some unfortunate logic handling to prevent saving twice.
            if (event === 'blur' && $scope.saveEvent === 'submit') {
                $scope.saveEvent = null;
                return;
            }

            $scope.saveEvent = event;

            if ($scope.reverted) {
                // Todo edits were reverted-- don't save.
                $scope.reverted = null;
                return;
            }

            todo.title = todo.title.trim();

            if (todo.title === $scope.originalTodo.title) {
                $scope.editedTodo = null;
                return;
            }

            store[todo.title ? 'putTodo' : 'deleteTodo'](todo, list)
                .then(function success() {
                }, function error() {
                    todo.title = $scope.originalTodo.title;
                })
                .finally(function () {
                    $scope.editedTodo = null;
                });
        };

        $scope.saveListEdits = function (list, event) {
            // Blur events are automatically triggered after the form submit event.
            // This does some unfortunate logic handling to prevent saving twice.
            if (event === 'blur' && $scope.saveEvent === 'submit') {
                $scope.saveEvent = null;
                return;
            }

            $scope.saveEvent = event;

            if ($scope.revertedList) {
                $scope.revertedList = null;
                return;
            }

            list.name = list.name.trim();

            if (list.name === $scope.originalTodoList.name) {
                $scope.editedTodoList = null;
                return;
            }

            store[list.name ? 'putTodoList' : 'deleteTodoList'](list)
                .then(function success() {
                }, function error() {
                    list.name = $scope.originalTodoList.name;
                })
                .finally(function () {
                    $scope.editedTodoList = null;
                });
        };

        $scope.revertEdits = function (list, todo) {
            list.items[list.items.indexOf(todo)] = $scope.originalTodo;
            $scope.editedTodo = null;
            $scope.originalTodo = null;
            $scope.reverted = true;
        };

        $scope.revertListEdits = function(list) {
            $scope.todolists[$scope.todolists.indexOf(list)] = $scope.originalTodoList;
            $scope.editedTodoList = null;
            $scope.originalTodoList = null;
            $scope.revertedList = true;
        }

        $scope.removeTodo = function (list, todo) {
            store.deleteTodo(todo, list);
        };

        $scope.removeTodoList = function (list) {
            if (confirm("Please confirm you want to remove '"+list.name+"' todo list")) {
                store.deleteTodoList(list);
            } else {

            }
        };

        $scope.saveTodo = function (todo) {
            store.putTodo(todo);
        };

        $scope.toggleCompleted = function (list, todo, completed) {
            if (angular.isDefined(completed)) {
                todo.completed = completed;
            }

            store.putTodo(todo, list)
                .then(function success() {
                }, function error() {
                    todo.completed = !todo.completed;
                });
        };

        $scope.clearCompletedTodos = function (list) {
            store.clearCompleted(list);
        };

        $scope.markAll = function (list, completed) {
            list.items.forEach(function (todo) {
                if (todo.completed !== completed) {
                    $scope.toggleCompleted(list, todo, completed);
                }
            });
        };

        $scope.setStatus = function (list, status) {
            $scope.status[list.id] = status;
            if (status === 'active') {
                $scope.statusFilter[list.id] = {completed: false};
            }
            else if (status === 'completed') {
                $scope.statusFilter[list.id] = {completed: true};
            }
            else {
                $scope.statusFilter[list.id] = {};
            }
        }
    });
