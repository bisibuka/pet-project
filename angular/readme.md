# Pet Project - TodoMVC

Just imagine you've been hired to work on the (hypothetical) Kreios TodoMVC project, a project whose purpose is to create a cheap knock-off of the more popular [Wunderlist](https://www.wunderlist.com/) application.

__Core features:__
* Manage a list of todo items
* Mark items as complete
* Clear (i.e. forget about) completed items
* Filter items by status

The pre-sales team has already built a small prototype of the core application, which you are now supposed to extend into the full-fledged application. That prototype is just a bit of JavaScript, HTML and CSS - no back-end what-so-ever!

## How to get started ##
* Install Node.js version 5.7.0
* Install IntelliJ (optional)
* Use `npm install` to install the projects dependencies
* Use `npm test` to run the projects test suite
* Create a personal fork of the [official "Pet Store" repository](https://bitbucket.kreios.lu/projects/PET/repos/pet-project/browse) on the Kreios Bitbucket server

## Tasks

This section outlines the tasks we'd like you to work on, listed in order of priority.

**We use this pet project to evaluate AngularJS+Node.js and AngularJS+Django developers alike, so please make sure to stick with the list of todo items directly under the name of the technology stacks that you have been requested to use.**

Each task should be implemented on a dedicated feature branch (following the [git flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) branching model). Once you consider that feature to be completely implemented and ready to be shipped, you should push the feature branch back to the server and then then create a pull request that best summarizes the state of your work.

### AngularJS + Node.js
* **_TODO-1_: Add support for managing more than one list.** This includes the ability for the user to add new/delete existing lists as well as to give each list a meaningful name. Make sure the UI extensions required are consistent with the existing visual style of the application and that there are meaningful unit tests for the new feature, as well.
* **_TODO-2_: Replace the local storage with a proper server-side back-end** implemented on top of [Socket.io](http://socket.io/). All connected clients should share the same lists. Updates requested by one client should immediately be made visible to all other clients without explicit page refresh (e.g. using the CQRS pattern).
* **_TODO-3_: Add a basic build process** (using [Grunt](http://gruntjs.com/)) that automatically...
  * ...(re)starts the back-end process via `nodemon` as required.
  * ...uses `livereload` to automatically trigger updates in the browser as required.
  * ...performs static code analysis via `jshint` whenever a file changes.
  * ...re-runs the unit test suite (built on top of `karma` and `jasmine`) whenever a file changes.
* **_TODO-4_: Build a basic suite of functional (UI) test cases** on top of [Protractor](https://angular.github.io/protractor/#/). Use [Docker](https://www.docker.com/) to make sure this test suite can be easily executed on an arbitrary machine, such as the (headless) Linux server used for continuous integration..

### AngularJS + Django
* **_TODO-1_: Add support for managing more than one list.** This includes the ability for the user to add new/delete existing lists as well as to give each list a meaningful name. Make sure the UI extensions required are consistent with the existing visual style of the application and that there are meaningful unit tests for the new feature, as well.
* **_TODO-2_: Replace the local storage with a proper server-side back-end** implemented on top of Django and the [Django REST framework](http://www.django-rest-framework.org/). All connected clients should share the same lists.
* **_TODO-3_: Implement a simple admin interface for todo lists** using the Django admin framework as well as a third-party admin skin of your choice (e.g. Django Grappelli or Django Suit). That admin interface should feature a detail page for each available todo list, with the individual items of that list being rendered inline.
* **_TODO-4_: Add support for versioning todo lists** by integrating and configuring the standard [Django Reversion](https://github.com/etianen/django-reversion) add-on. Make sure changes to a list of todo items (regardless of whether that change is performed via the AngularJS or Django Admin UI) automatically result in a new version record being created.
* **_TODO-5_: Build a basic suite of functional (UI) test cases** on top of [Protractor](https://angular.github.io/protractor/#/). Use [Docker](https://www.docker.com/) to make sure this test suite can be easily executed on an arbitrary machine, such as the (headless) Linux server used for continuous integration.
