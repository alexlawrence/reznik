'use strict';

var testMethod = require('../../src/analysis/findMissingDependencies.js');

describe('analysis/findMissingDependencies', function() {

    it('should not add an error when no modules are available', function() {

        var result = {
            modules: {},
            errors: []
        };

        testMethod(result);

        expect(result.errors.length).toBe(0);
    });

    it('should not add an error when all dependencies are available', function() {

        var result = {
            modules: {
                'a': {filename: 'a.js', dependencies: ['b', 'c']},
                'b': {filename: 'b.js', dependencies: ['c']},
                'c': {filename: 'c.js', dependencies: []}
            },
            errors: []
        };

        testMethod(result);

        expect(result.errors.length).toBe(0);
    });

    it('should add an error when a modules dependency is undefined', function() {

        var result = {
            modules: {
                'a': {filename: 'a.js', dependencies: ['b']},
                'b': {filename: 'b.js', dependencies: ['c']}
            },
            errors: []
        };

        testMethod(result);

        expect(result.errors.length).toBe(1);
    });

});
