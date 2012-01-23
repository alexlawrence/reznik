'use strict';

var subject = require('../../src/reporting/plainReporter.js');

describe('plainReporter', function() {

    describe('render', function() {

        it('should serialize the modules and their dependencies', function() {

            var evaluationResult = {
                modules: {
                    'm/a': {dependencies: ['m/b']},
                    'm/b': {dependencies: ['m/c', 'm/d']},
                    'm/c': {dependencies: ['m/d']},
                    'm/d': {dependencies: []}
                },
                errors: []
            };

            var result = subject.render(evaluationResult);

            expect(result).toContain('#modules');
            expect(result).toContain('m/a:m/b');
            expect(result).toContain('m/b:m/c,m/d');
            expect(result).toContain('m/c:m/d');
            expect(result).toContain('m/d');
        });

        it('should serialize properties starting with "modules" in the same way as modules', function() {

            var evaluationResult = {
                modulesFoobar: {
                    'm/a': {dependencies: ['m/b']},
                    'm/b': {dependencies: ['m/c', 'm/d']},
                    'm/c': {dependencies: ['m/d']},
                    'm/d': {dependencies: []}
                },
                errors: []
            };

            var result = subject.render(evaluationResult);

            expect(result).toContain('#modulesFoobar');
            expect(result).toContain('m/a:m/b');
            expect(result).toContain('m/b:m/c,m/d');
            expect(result).toContain('m/c:m/d');
            expect(result).toContain('m/d');
        });

        it('should serialize the errors', function() {

            var evaluationResult = {
                modules: {},
                errors: ['error 1', 'error 2', 'error 3']
            };

            var result = subject.render(evaluationResult);

            expect(result).toContain('#errors');
            expect(result).toContain('error 1');
            expect(result).toContain('error 2');
            expect(result).toContain('error 3');

        });

        it('should serialize the information messages', function() {

            var evaluationResult = {
                modules: {},
                errors: [],
                information: ['did something', 'did something else']
            };

            var result = subject.render(evaluationResult);

            expect(result).toContain('#information');
            expect(result).toContain('did something');
            expect(result).toContain('did something else');
        });

    });

});