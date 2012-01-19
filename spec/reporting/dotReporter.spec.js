'use strict';

var subject = require('../../src/reporting/dotReporter.js');

describe('dotReporter', function() {

    describe('render', function() {

        it('should render in the correct dot format', function() {

            var evaluationResult = {
                modules: {},
                errors: []
            };

            var result = subject.render(evaluationResult);

            expect(result).toContain('digraph dependencies');

        });

        it('should serialize modules with dependencies', function() {

            var evaluationResult = {
                modules: {
                    'm/a': ['m/b'],
                    'm/b': ['m/c', 'm/d'],
                    'm/c': ['m/d'],
                    'm/d': [] },
                errors: []
            };

            var result = subject.render(evaluationResult);

            expect(result).toContain('"m/a" -> "m/b";');
            expect(result).toContain('"m/b" -> "m/c";');
            expect(result).toContain('"m/b" -> "m/d";');
            expect(result).toContain('"m/c" -> "m/d";');

        });

        it('should serialize modules without dependencies', function() {

            var evaluationResult = {
                modules: {
                    'm/a': ['m/b'],
                    'm/b': ['m/c', 'm/d'],
                    'm/c': ['m/d'],
                    'm/d': [] },
                errors: []
            };

            var result = subject.render(evaluationResult);

            expect(result).toContain('"m/d";');
        });
    });
});
