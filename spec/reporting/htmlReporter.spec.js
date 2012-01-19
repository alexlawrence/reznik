'use strict';

var subject = require('../../src/reporting/htmlReporter.js');

describe('htmlReporter', function() {

    describe('render', function() {

        it('should not throw an error when given an empty result object', function() {

            var evaluationResult = {};

            expect(function() {
                subject.render(evaluationResult);
            }).not.toThrow();

        });

        it('should return an unordered list of all errors', function() {

            var evaluationResult = {
                errors: ['error 1', 'error 2']
            };

            var output = subject.render(evaluationResult);

            expect(output).toContain(
                '<ul class="messages errors"><li class="message">error 1</li><li class="message">error 2</li></ul>');

        });

        it('should return an unordered list of all information', function() {

            var evaluationResult = {
                information: ['information 1', 'information 2']
            };

            var output = subject.render(evaluationResult);

            expect(output).toContain(
                '<ul class="messages information"><li class="message">information 1</li><li class="message">information 2</li></ul>');

        });

        it('should return an unordered list for each module and its dependencies', function() {

            var evaluationResult = {
                modules: {
                    'a': ['b', 'c']
                }
            };

            var output = subject.render(evaluationResult);

            expect(output).toContain(
                '<span class="moduleId">a</span><ul class="dependencies"><li class="dependency">b</li><li class="dependency">c</li></ul>');

        });

        it('should return an unordered list for each flattened module and its dependencies', function() {

            var evaluationResult = {
                modulesFlattened: {
                    'a': ['b', 'c']
                }
            };

            var output = subject.render(evaluationResult);

            expect(output).toContain(
                '<span class="moduleId">a</span><ul class="dependencies"><li class="dependency">b</li><li class="dependency">c</li></ul>');

        });

        it('should return an unordered list for each inverted module and its dependencies', function() {

            var evaluationResult = {
                modulesInverted: {
                    'a': ['b', 'c']
                }
            };

            var output = subject.render(evaluationResult);

            expect(output).toContain(
                '<span class="moduleId">a</span><ul class="dependencies"><li class="dependency">b</li><li class="dependency">c</li></ul>');

        });

    });

});