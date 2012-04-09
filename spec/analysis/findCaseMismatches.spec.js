'use strict';

var testMethod = require('../../src/analysis/findCaseMismatches.js');

describe('analysis/findCaseMismatches', function() {

    it('should not add an error when no modules are available', function() {

        var result = {
            modules: {},
            errors: []
        };

        testMethod(result);

        expect(result.errors.length).toBe(0);
    });

    it('should not add an error when module ids are different than the filenames', function() {

        var result = {
            modules: {
                'a': {filename: 'moduleA.js', dependencies: []},
                'b': {filename: 'moduleB.js', dependencies: []}
            },
            errors: []
        };

        testMethod(result);

        expect(result.errors.length).toBe(0);

    });

    it('should not add an error when module ids and filenames are equal', function() {

        var result = {
            modules: {
                'moduleA': {filename: 'moduleA.js', dependencies: []},
                'moduleB': {filename: 'moduleB.js', dependencies: []}
            },
            errors: []
        };

        testMethod(result);

        expect(result.errors.length).toBe(0);

    });

    it('should add an error when a module id and a filename are equal but have different cases', function() {

        var result = {
            modules: {
                'modulea': {filename: 'moduleA.js'}
            },
            errors: []
        };

        testMethod(result);

        expect(result.errors.length).toBe(1);

    });

});
