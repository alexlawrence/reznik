var subject = require('../src/util.js');

describe('util', function() {

    describe('executeAndIgnoreErrors', function() {

        it('should not throw an error when code to run produces an error', function() {

            expect(function() {
                subject.executeAndIgnoreErrors(function() {
                    foobar.foobar = 'foobar';
                });
            }).not.toThrow();

        });

    });

});