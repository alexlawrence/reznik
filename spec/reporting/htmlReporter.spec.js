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
                '<ul class="list errors"><li class="item">error 1</li><li class="item">error 2</li></ul>');

        });

        it('should return an unordered list of all information', function() {

            var evaluationResult = {
                information: ['information 1', 'information 2']
            };

            var output = subject.render(evaluationResult);

            expect(output).toContain(
                '<ul class="list information"><li class="item">information 1</li><li class="item">information 2</li></ul>');

        });

        it('should return an unordered list for each module and its dependencies', function() {

            var evaluationResult = {
                modules: {
                    'a': ['b', 'c']
                }
            };

            var output = subject.render(evaluationResult);

            expect(output).toContain(
                '<span class="title">a</span><ul class="itemList"><li class="item">b</li><li class="item">c</li></ul>');

        });

        it('should return an unordered list for each flattened module and its dependencies', function() {

            var evaluationResult = {
                modulesFlattened: {
                    'a': ['b', 'c']
                }
            };

            var output = subject.render(evaluationResult);

            expect(output).toContain(
                '<span class="title">a</span><ul class="itemList"><li class="item">b</li><li class="item">c</li></ul>');

        });

        it('should return an unordered list for each inverted module and its dependencies', function() {

            var evaluationResult = {
                modulesInverted: {
                    'a': ['b', 'c']
                }
            };

            var output = subject.render(evaluationResult);

            expect(output).toContain(
                '<span class="title">a</span><ul class="itemList"><li class="item">b</li><li class="item">c</li></ul>');

        });

    });

});