var subject = require('../../src/processing/reporter.js');

describe('reporter', function() {

    describe('toPlain', function() {

        it('should serialize the modules and their dependencies', function() {

            var evaluationResult = {
                modules: {
                    'm/a': ['m/b'],
                    'm/b': ['m/c', 'm/d'],
                    'm/c': ['m/d'],
                    'm/d': [] },
                errors: []
            };

            var result = subject.toPlain(evaluationResult);

            expect(result).toContain(
                '#modules\n' +
                'm/a:m/b\n' +
                'm/b:m/c,m/d\n' +
                'm/c:m/d\n' +
                'm/d:\n');
        });

        it('should serialize properties starting with "modules" in the same way as modules', function() {

            var evaluationResult = {
                modulesFoobar: {
                    'm/a': ['m/b'],
                    'm/b': ['m/c', 'm/d'],
                    'm/c': ['m/d'],
                    'm/d': [] },
                errors: []
            };

            var result = subject.toPlain(evaluationResult);

            expect(result).toContain(
                '#modulesFoobar\n' +
                'm/a:m/b\n' +
                'm/b:m/c,m/d\n' +
                'm/c:m/d\n' +
                'm/d:\n');
        });

        it('should serialize the errors', function() {

            var evaluationResult = {
                modules: {},
                errors: ['error 1', 'error 2', 'error 3']
            };

            var result = subject.toPlain(evaluationResult);

            expect(result).toContain(
                '#errors\n' +
                'error 1\n' +
                'error 2\n' +
                'error 3\n');

        });

        it('should serialize the information messages', function() {

            var evaluationResult = {
                modules: {},
                errors: [],
                information: ['did something', 'did something else']
            };

            var result = subject.toPlain(evaluationResult);

            expect(result).toContain(
                '#information\n' +
                'did something\n' +
                'did something else\n');

        });

    });

    describe('toJSON', function() {

        it('should serialize the modules and dependencies', function() {

            var evaluationResult = {
                modules: {
                    'm/a': ['m/b'],
                    'm/b': ['m/c', 'm/d'],
                    'm/c': ['m/d'],
                    'm/d': [] },
                errors: []
            };

            var result = subject.toJSON(evaluationResult);

            expect(result).toContain('"modules":{"m/a":["m/b"],"m/b":["m/c","m/d"],"m/c":["m/d"],"m/d":[]}');

        });

        it('should serialize properties starting with "modules" in the same way as modules', function() {

             var evaluationResult = {
                 modulesFoobar: {
                     'm/a': ['m/b'],
                     'm/b': ['m/c', 'm/d'],
                     'm/c': ['m/d'],
                     'm/d': [] },
                 errors: []
             };

             var result = subject.toJSON(evaluationResult);

             expect(result).toContain('"modulesFoobar":{"m/a":["m/b"],"m/b":["m/c","m/d"],"m/c":["m/d"],"m/d":[]}');
         });


        it('should serialize the errors', function() {

            var evaluationResult = {
                modules: {},
                errors: ['error 1', 'error 2', 'error 3']
            };

            var result = subject.toJSON(evaluationResult);

            expect(result).toContain('"errors":["error 1","error 2","error 3"]');

        });

        it('should serialize the information messages', function() {

            var evaluationResult = {
                modules: {},
                errors: [],
                information: ['did something', 'did something else']
            };

            var result = subject.toJSON(evaluationResult);

            expect(result).toContain('"information":["did something","did something else"]');

        });

    });

});