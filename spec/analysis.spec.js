var subject = require('../src/analysis.js');

describe('analysis', function() {

    describe('checkMissingDependencies', function() {

        it('should add an error to the evaluation result if a module´s dependency is undefined', function() {

            var result = {
                modules: {
                    'a': ['b']
                },
                errors: []
            }

            subject.checkMissingDependencies(result);

            expect(result.errors[0]).toBe('missing dependency b in a.js');
        });

    });

});