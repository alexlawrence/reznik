'use strict';

var subject = require('../../src/reporting/plainReporter.js');

describe('plainReporter', function() {

    describe('render', function() {

        it('should serialize the modules and their dependencies', function() {

            var evaluationResult = {
                modules: {
                    'moduleA': {dependencies: ['moduleB']},
                    'moduleB': {dependencies: ['moduleC', 'moduleD']},
                    'moduleC': {dependencies: ['moduleD']},
                    'moduleD': {dependencies: []}
                },
                errors: []
            };

            var result = subject.render(evaluationResult);

            expect(result).toMatch(
                /\s*#modules\s*moduleA:moduleB\s*moduleB:moduleC,moduleD\s*moduleC:moduleD\s*moduleD\s*/);
        });

        it('should serialize a list of all anonymous modules', function() {

            var evaluationResult = {
                modules: {
                    'moduleA': {anonymous: true},
                    'moduleB': {anonymous: true},
                    'moduleC': {anonymous: false},
                    'moduleD': {anonymous: false}
                },
                errors: []
            };

            var result = subject.render(evaluationResult);

            expect(result).toMatch(/\s*#anonymous modules\s*moduleA\s*moduleB\s*/);
        });

        it('should serialize properties starting with "modules" in the same way as modules', function() {

            var evaluationResult = {
                modulesFoobar: {
                    'moduleA': {dependencies: ['moduleB']},
                    'moduleB': {dependencies: ['moduleC', 'moduleD']},
                    'moduleC': {dependencies: ['moduleD']},
                    'moduleD': {dependencies: []}
                },
                errors: []
            };

            var result = subject.render(evaluationResult);

            expect(result).toMatch(
                /\s*#modulesFoobar\s*moduleA:moduleB\s*moduleB:moduleC,moduleD\s*moduleC:moduleD\s*moduleD\s*/);
        });

        it('should serialize the errors', function() {

            var evaluationResult = {
                modules: {},
                errors: ['error 1', 'error 2', 'error 3']
            };

            var result = subject.render(evaluationResult);

            expect(result).toMatch(
                /\s*#errors\s*error 1\s*error 2\s*error 3\s*/);

        });

        it('should serialize the information messages', function() {

            var evaluationResult = {
                modules: {},
                errors: [],
                information: ['did something', 'did something else']
            };

            var result = subject.render(evaluationResult);

            expect(result).toMatch(
                /\s*#information\s*did something\s*did something else\s*/);
        });

    });

});