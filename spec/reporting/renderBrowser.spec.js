'use strict';

var testMethod = require('../../src/reporting/renderBrowser.js');

describe('reporting/browser/renderBrowser', function() {

    it('should not throw an error when given an empty result object', function() {

        var evaluationResult = {};

        expect(function() {
            testMethod(evaluationResult);
        }).not.toThrow();

    });

    it('should return an unordered list of all errors', function() {

        var evaluationResult = {
            errors: ['error 1', 'error 2']
        };

        var output = testMethod(evaluationResult);

        expect(output).toContain(
            '<ul class="messages errors"><li class="message">error 1</li><li class="message">error 2</li></ul>');

    });

    it('should return an unordered list of all information', function() {

        var evaluationResult = {
            information: ['information 1', 'information 2']
        };

        var output = testMethod(evaluationResult);

        expect(output).toContain(
            '<ul class="messages information"><li class="message">information 1</li><li class="message">information 2</li></ul>');

    });

    it('should return an unordered list for each module and its dependencies', function() {

        var evaluationResult = {
            modules: {
                'a': {filename: 'a.js', dependencies: ['b', 'c']},
                'd': {filename: 'd.js', dependencies: ['e', 'f']}
            }
        };

        var output = testMethod(evaluationResult);

        expect(output).toContain(
            '<li class="module withDependencies">' +
                '<span class="moduleTitle"><span class="moduleId">a</span><span class="moduleFilename">a.js</span></span>' +
                '<ul class="dependencies"><li class="dependency">b</li><li class="dependency">c</li></ul>' +
            '</li>');
        expect(output).toContain(
            '<li class="module withDependencies">' +
                '<span class="moduleTitle"><span class="moduleId">d</span><span class="moduleFilename">d.js</span></span>' +
                '<ul class="dependencies"><li class="dependency">e</li><li class="dependency">f</li></ul>' +
            '</li>');


    });

    it('should not add the class "withDependencies" for modules without dependencies', function() {

        var evaluationResult = {
            modules: {
                'e': {filename: 'e.js', dependencies: []}
            }
        };

        var output = testMethod(evaluationResult);

        expect(output).toContain(
            '<li class="module">' +
                '<span class="moduleTitle"><span class="moduleId">e</span><span class="moduleFilename">e.js</span></span>' +
                '<ul class="dependencies"></ul>' +
            '</li>');
    });

    it('should return an unordered list for each flattened module and its dependencies', function() {

        var evaluationResult = {
            modulesFlattened: {
                'a': {filename: 'a.js', dependencies: ['b', 'c']},
                'd': {filename: 'd.js', dependencies: ['e', 'f']}
            }
        };

        var output = testMethod(evaluationResult);

        expect(output).toContain(
            '<li class="module withDependencies">' +
                '<span class="moduleTitle"><span class="moduleId">a</span><span class="moduleFilename">a.js</span></span>' +
                '<ul class="dependencies"><li class="dependency">b</li><li class="dependency">c</li></ul>' +
            '</li>');
        expect(output).toContain(
            '<li class="module withDependencies">' +
                '<span class="moduleTitle"><span class="moduleId">d</span><span class="moduleFilename">d.js</span></span>' +
                '<ul class="dependencies"><li class="dependency">e</li><li class="dependency">f</li></ul>' +
            '</li>');

    });

    it('should return an unordered list for each inverted module and its dependencies', function() {

        var evaluationResult = {
            modulesInverted: {
                'a': {filename: 'a.js', dependencies: ['b', 'c']},
                'd': {filename: 'd.js', dependencies: ['e', 'f']}
            }
        };

        var output = testMethod(evaluationResult);

        expect(output).toContain(
            '<li class="module withDependencies">' +
                '<span class="moduleTitle"><span class="moduleId">a</span><span class="moduleFilename">a.js</span></span>' +
                '<ul class="dependencies"><li class="dependency">b</li><li class="dependency">c</li></ul>' +
            '</li>');
        expect(output).toContain(
            '<li class="module withDependencies">' +
                '<span class="moduleTitle"><span class="moduleId">d</span><span class="moduleFilename">d.js</span></span>' +
                '<ul class="dependencies"><li class="dependency">e</li><li class="dependency">f</li></ul>' +
            '</li>');

    });

});