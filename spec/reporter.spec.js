var subject = require('../src/reporter.js');

describe('reporter', function() {

    describe('toPlain', function() {

        it('should serialize the modules and dependencies correctly to plain text', function() {

            var evaluationResult = {
                modules: {
                    'm/a': ['m/b'],
                    'm/b': ['m/c', 'm/d'],
                    'm/c': ['m/d'],
                    'm/d': [] },
                errors: []
            };

            var result = subject.toPlain(evaluationResult);

            expect(result).toBe(
                'modules:\n' +
                'm/a m/b\n' +
                'm/b m/c,m/d\n' +
                'm/c m/d\n' +
                'm/d\n' +
                'errors:\n');
        });

        it('should serialize the errors correctly to plain text', function() {

            var evaluationResult = {
                modules: {},
                errors: ['error 1', 'error 2', 'error 3']
            };

            var result = subject.toPlain(evaluationResult);

            expect(result).toBe(
                'modules:\n' +
                'errors:\n' +
                'error 1\n' +
                'error 2\n' +
                'error 3\n');

        });

    });

    describe('toJSON', function() {

        it('should serialize the modules and dependencies correctly to json', function() {

            var evaluationResult = {
                modules: {
                    'm/a': ['m/b'],
                    'm/b': ['m/c', 'm/d'],
                    'm/c': ['m/d'],
                    'm/d': [] },
                errors: []
            };

            var result = subject.toJSON(evaluationResult);

            expect(result).toBe('{"modules":{"m/a":["m/b"],"m/b":["m/c","m/d"],"m/c":["m/d"],"m/d":[]},"errors":[]}');

        });

        it('should serialize the errors correctly to json', function() {

            var evaluationResult = {
                modules: {},
                errors: ['error 1', 'error 2', 'error 3']
            };

            var result = subject.toJSON(evaluationResult);

            expect(result).toBe('{"modules":{},"errors":["error 1","error 2","error 3"]}');

        });

    });

    describe('toXML', function() {

        it('should serialize the modules and dependencies correctly to xml', function() {

            var evaluationResult = {
                modules: {
                    'm/a': ['m/b'],
                    'm/b': ['m/c', 'm/d'],
                    'm/c': ['m/d'],
                    'm/d': [] },
                errors: []
            };

            var expectedResult =
                '<evaluationResult>' +
                '<modules>' +
                '<module id="m/a"><dependency>m/b</dependency></module>' +
                '<module id="m/b"><dependency>m/c</dependency><dependency>m/d</dependency></module>' +
                '<module id="m/c"><dependency>m/d</dependency></module>' +
                '<module id="m/d"></module>' +
                '</modules>' +
                '<errors>' +
                '</errors>' +
                '</evaluationResult>';

            var result = subject.toXML(evaluationResult);

            expect(result).toBe(expectedResult);

        });

        it('should serialize the errors correctly to xml', function() {

            var evaluationResult = {
                modules: {},
                errors: ['error 1', 'error 2', 'error 3']
            };

            var expectedResult =
                '<evaluationResult>' +
                '<modules>' +
                '</modules>' +
                '<errors>' +
                '<error>error 1</error>' +
                '<error>error 2</error>' +
                '<error>error 3</error>' +
                '</errors>' +
                '</evaluationResult>';

            var result = subject.toXML(evaluationResult);

            expect(result).toBe(expectedResult);

        });

    });

});