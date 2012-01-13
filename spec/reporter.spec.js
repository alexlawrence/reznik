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

            expect(result).toContain(
                '#modules\n' +
                'm/a:m/b\n' +
                'm/b:m/c,m/d\n' +
                'm/c:m/d\n' +
                'm/d:\n');
        });

        it('should serialize the errors correctly to plain text', function() {

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

        it('should serialize the information notes correctly to plain text', function() {

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

            expect(result).toContain('"modules":{"m/a":["m/b"],"m/b":["m/c","m/d"],"m/c":["m/d"],"m/d":[]}');

        });

        it('should serialize the errors correctly to json', function() {

            var evaluationResult = {
                modules: {},
                errors: ['error 1', 'error 2', 'error 3']
            };

            var result = subject.toJSON(evaluationResult);

            expect(result).toContain('"errors":["error 1","error 2","error 3"]');

        });

        it('should serialize the information notes correctly to json', function() {

            var evaluationResult = {
                modules: {},
                errors: [],
                information: ['did something', 'did something else']
            };

            var result = subject.toJSON(evaluationResult);

            expect(result).toContain('"information":["did something","did something else"]');

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
                '<modules>' +
                '<module id="m/a"><dependency>m/b</dependency></module>' +
                '<module id="m/b"><dependency>m/c</dependency><dependency>m/d</dependency></module>' +
                '<module id="m/c"><dependency>m/d</dependency></module>' +
                '<module id="m/d"></module>' +
                '</modules>';

            var result = subject.toXML(evaluationResult);

            expect(result).toContain(expectedResult);

        });

        it('should serialize the errors correctly to xml', function() {

            var evaluationResult = {
                modules: {},
                errors: ['error 1', 'error 2', 'error 3']
            };

            var expectedResult =
                '<errors>' +
                '<error>error 1</error>' +
                '<error>error 2</error>' +
                '<error>error 3</error>' +
                '</errors>';

            var result = subject.toXML(evaluationResult);

            expect(result).toContain(expectedResult);

        });

        it('should serialize the information notes correctly to xml', function() {

            var evaluationResult = {
                modules: {},
                errors: [],
                information: ['did something', 'did something else']
            };

            var result = subject.toXML(evaluationResult);

            expect(result).toContain(
                '<information><message>did something</message><message>did something else</message></information>');

        });

    });

});