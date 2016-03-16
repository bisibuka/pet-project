/*global describe, it, beforeEach, inject, expect*/
(function () {
    'use strict';

    describe('Todo Controller', function () {
        var ctrl, scope, store;

        // Load the module containing the app, only 'ng' is loaded by default.
        beforeEach(module('todomvc'));

        beforeEach(inject(function ($controller, $rootScope, localStorage) {
            scope = $rootScope.$new();

            store = localStorage;

            localStorage.lists = [];
            localStorage._getFromLocalStorage = function () {
                return [];
            };
            localStorage._saveToLocalStorage = function (list, todos) {
                localStorage.lists[localStorage.lists.indexOf(list)].items = todos;
            };

            localStorage._saveListsToLocalStorage = function (lists) {
                localStorage.lists = lists;
            };

            ctrl = $controller('TodoCtrl', {
                $scope: scope,
                store : store
            });
        }));

        it('should not have an edited Todo on start', function () {
            expect(scope.editedTodo).toBeNull();
        });

        it('should not have an edited Todo List on start', function () {
            expect(scope.editedTodoList).toBeNull();
        });

        it('should not have any todo lists on start', function () {
            expect(scope.todolists.length).toBe(0);
        });

        it('should have all Todos completed', function () {
            scope.$digest();
            expect(Object.keys(scope.allChecked).length).toBe(0);
        });

        describe('having no Todos', function () {
            var ctrl;

            beforeEach(inject(function ($controller) {
                ctrl = $controller('TodoCtrl', {
                    $scope: scope,
                    store : store
                });
                var list = {id: 1, name: "Beautiful list #1", items: []};
                store.insertTodoList(list);
                scope.$digest();
            }));

            it('should not add empty Todos', function () {
                scope.newTodo = {};
                var list = scope.todolists[0];
                scope.addTodo(list);
                scope.$digest();
                expect(scope.todolists[0].items.length).toBe(0);
            });

            it('should not add todo lists with empty name', function () {
                scope.newTodoList = '';
                scope.addTodoList();
                scope.$digest();
                expect(scope.todolists.length).toBe(1);
            });

            it('should not add items consisting only of whitespaces', function () {
                var list = scope.todolists[0];
                scope.newTodo = {};
                scope.newTodo[list.id] = '   ';
                scope.addTodo(list);
                scope.$digest();
                expect(scope.todolists[0].items.length).toBe(0);
            });

            it('should not add todo lists with name consisting only of whitespaces', function () {
                scope.newTodoList = '      ';
                scope.addTodoList();
                scope.$digest();
                expect(scope.todolists.length).toBe(1);
            });

            it('should trim whitespace from new Todos', function () {
                var list = scope.todolists[0];
                scope.newTodo = {};
                scope.newTodo[list.id] = '  buy some unicorns  ';
                scope.addTodo(list);
                scope.$digest();
                expect(store.lists[0].items.length).toBe(1);
                expect(store.lists[0].items[0].title).toBe('buy some unicorns');
            });

            it('should trim whitespace from new Todo List', function () {
                scope.newTodoList = '  TODO list of a unicorn  ';
                scope.addTodoList();
                scope.$digest();
                expect(store.lists.length).toBe(2);
                expect(store.lists[1].name).toBe('TODO list of a unicorn');
            });
        });

        describe('the filter', function () {
            var ctrl;

            beforeEach(inject(function ($controller) {
                ctrl = $controller('TodoCtrl', {
                    $scope: scope,
                    store : store
                });

                var list = {id: 1, name: "Beautiful list #1", items: []};

                list.items.push({title: 'Uncompleted Item 0', completed: false});
                list.items.push({title: 'Uncompleted Item 1', completed: false});
                list.items.push({title: 'Uncompleted Item 2', completed: false});
                list.items.push({title: 'Completed Item 0', completed: true});
                list.items.push({title: 'Completed Item 1', completed: true});
                store.insertTodoList(list);
                scope.$digest();
            }));

            it('should default to ""', function () {
                var list = scope.todolists[0];
                expect(scope.status[list.id]).toEqual('');
                expect(Object.keys(scope.statusFilter).length).toBe(0);
            });

            describe('clicking on Active', function () {
                it('should filter non-completed', inject(function () {
                    var list = scope.todolists[0];
                    scope.setStatus(list, 'active');
                    scope.$digest();
                    expect(scope.statusFilter[list.id].completed).toBeFalsy();
                }));
            });

            describe('clicking on Completed', function () {
                it('should filter completed', inject(function () {
                    var list = scope.todolists[0];
                    scope.setStatus(list, 'completed');
                    scope.$digest();
                    expect(scope.statusFilter[list.id].completed).toBeTruthy();
                }));
            });

            describe('clicking on All', function () {
                it('should show all', inject(function () {
                    var list = scope.todolists[0];
                    scope.setStatus(list, '');
                    scope.$digest();
                    expect(Object.keys(scope.statusFilter[list.id]).length).toBe(0);
                }));
            });
        });

        describe('having some saved Todos', function () {
            var ctrl;

            beforeEach(inject(function ($controller) {
                ctrl = $controller('TodoCtrl', {
                    $scope: scope,
                    store : store
                });

                var list = {id: 1, name: "Beautiful list #1", items: []};

                list.items.push({title: 'Uncompleted Item 0', completed: false});
                list.items.push({title: 'Uncompleted Item 1', completed: false});
                list.items.push({title: 'Uncompleted Item 2', completed: false});
                list.items.push({title: 'Completed Item 0', completed: true});
                list.items.push({title: 'Completed Item 1', completed: true});
                store.insertTodoList(list);
                scope.$digest();

                spyOn(window, 'confirm').and.callFake(function () {
                    return true;
                });
            }));

            it('should count Todos correctly', function () {
                var list = scope.todolists[0];
                expect(scope.todolists.length).toBe(1);
                expect(list.items.length).toBe(5);
                expect(scope.remainingCount[list.id]).toBe(3);
                expect(scope.completedCount[list.id]).toBe(2);
                expect(scope.allChecked[list.id]).toBeFalsy();
            });

            it('should save Todos and Lists to local storage', function () {
                var list = scope.todolists[0];
                expect(scope.todolists.length).toBe(1);
                expect(list.items.length).toBe(5);
            });

            it('should remove Todos w/o title on saving', function () {
                var list = store.lists[0];
                var todo = list.items[2];
                scope.editTodo(todo);
                todo.title = '';
                scope.saveEdits(todo, '', list);
                expect(list.items.length).toBe(4);
            });

            it('should remove Todo Lists w/o name on saving', function () {
                var list = scope.todolists[0];
                scope.editTodoList(list);
                list.name = '';
                scope.saveListEdits(list, '');
                expect(scope.todolists.length).toBe(0);
            });

            it('should trim Todos on saving', function () {
                var list = store.lists[0];
                var todo = list.items[0];
                scope.editTodo(todo);
                todo.title = ' buy moar unicorns  ';
                scope.saveEdits(todo, '', list);
                expect(scope.todolists[0].items[0].title).toBe('buy moar unicorns');
            });

            it('should trim Todo Lists on saving', function () {
                var list = store.lists[0];
                scope.editTodoList(list);
                list.name = ' Beautiful list #1 (modified)  ';
                scope.saveListEdits(list, '');
                expect(scope.todolists[0].name).toBe('Beautiful list #1 (modified)');
            });

            it('clearCompletedTodos() should clear completed Todos', function () {
                var list = store.lists[0];
                scope.clearCompletedTodos(list);
                expect(scope.todolists[0].items.length).toBe(3);
            });

            it('markAll() should mark all Todos completed', function () {
                var list = scope.todolists[0];
                scope.markAll(list, true);
                scope.$digest();
                expect(scope.completedCount[list.id]).toBe(5);
            });

            it('revertEdits() get a Todo to its previous state', function () {
                var list = store.lists[0];
                var todo = list.items[0];
                scope.editTodo(todo);
                todo.title = 'Unicorn sparkly skypuffles.';
                scope.revertEdits(list, todo);
                scope.$digest();
                expect(scope.todolists[0].items[0].title).toBe('Uncompleted Item 0');
            });

            it('revertListEdits() get a Todo List to its previous state', function () {
                var list = store.lists[0];
                scope.editTodoList(list);
                list.name = 'Beautiful list #2';
                scope.revertListEdits(list);
                scope.$digest();
                expect(scope.todolists[0].name).toBe('Beautiful list #1');
            });

            it('should delete Todo List successfully', function () {
                var list = store.lists[0];
                scope.removeTodoList(list);
                scope.$digest();
                expect(scope.todolists.length).toBe(0);
            });
        });
    });
}());
