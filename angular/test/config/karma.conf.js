module.exports = function (config) {
    'use strict';

    config.set({
        basePath  : '../../',
        frameworks: ['jasmine'],
        reporters : ['kjhtml'],
        files     : [
            'public/lib/angular/angular.js',
            'public/lib/angular-mocks/angular-mocks.js',
            'public/lib/angular-resource/angular-resource.js',
            'public/lib/angular-route/angular-route.js',
            'public/js/**/*.js',
            'test/unit/**/*.js'
        ],
        autoWatch : true,
        singleRun : false,
        browsers  : ['Chrome', 'Firefox']
    });
};
