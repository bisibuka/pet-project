(function () {
    'use strict';

    describe('Todo Controller', function() {

        beforeEach(function(){
            browser.get('/');
        });

        it('should have heading', function() {
            var heading1 = element(by.css('h1'));
            expect(heading1.getText()).toEqual('todos');
        });

        it('should show Todo List form', function() {
            expect(element(by.css('#new-todolist')).isPresent()).toBe(true);
        });

        it('should have todo lists', function() {
            element.all(by.css('section#main section.todo-list')).then(function(items){
                expect(items.length).toBeGreaterThan(0);
            });
        });
    });
}());