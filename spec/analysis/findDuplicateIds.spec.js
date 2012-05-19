'use strict';

var testMethod = require('../../src/analysis/findDuplicateIds.js');

describe('analysis/findDuplicateIds', function() {

    it('should not add an error when no modules are available', function() {

        var result = {
            scripts: [],
            errors: []
        };

        testMethod(result);

        expect(result.errors.length).toBe(0);
    });

    it('should not add an error when no duplicate module ids are given', function() {

        var result = {
            scripts: [
                {id: 'a', filename: 'a.js', dependencies: [], type: 'module'},
                {id: 'b', filename: 'b.js', dependencies: [], type: 'module'}
            ],
            errors: []
        };

        testMethod(result);

        expect(result.errors.length).toBe(0);

    });

    it('should add an error when duplicate module ids are given', function() {

        var result = {
            scripts: [
                {id: 'a', filename: 'a.js', dependencies: [], type: 'module'},
                {id: 'a', filename: 'a.js', dependencies: [], type: 'module'}
            ],
            errors: []
        };

        testMethod(result);

        expect(result.errors.length).toBe(1);

    });

    it('should not add an error when multiple require scripts are given', function() {

        var result = {
            scripts: [
                {filename: 'a.js', type: 'require'},
                {filename: 'b.js', type: 'require'}
            ],
            errors: []
        };

        testMethod(result);

        expect(result.errors.length).toBe(0);

    });

});
