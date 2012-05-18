'use strict';

var testMethod = require('../../src/analysis/findMissingDependencies.js');

describe('analysis/findMissingDependencies', function() {

    it('should not add an error when no modules are available', function() {

        var result = {
            scripts: [],
            errors: []
        };

        testMethod(result);

        expect(result.errors.length).toBe(0);
    });

    it('should not add an error when all dependencies are available', function() {

        var result = {
            scripts: [
                {filename: 'a.js', dependencies: ['b', 'c'], type: 'require'},
                {id: 'b', filename: 'b.js', dependencies: ['c'], type: 'module'},
                {id: 'c', filename: 'c.js', dependencies: [], type: 'module'}
            ],
            errors: []
        };

        testMethod(result);

        expect(result.errors.length).toBe(0);
    });

    it('should add an error when a modules dependency is undefined', function() {

        var result = {
            scripts: [
                {filename: 'a.js', dependencies: ['b'], type: 'require'},
                {id: 'b', filename: 'b.js', dependencies: ['c'], type: 'module'}
            ],
            errors: []
        };

        testMethod(result);

        expect(result.errors.length).toBe(1);
    });

});
