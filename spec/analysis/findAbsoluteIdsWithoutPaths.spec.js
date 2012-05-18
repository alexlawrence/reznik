'use strict';

var testMethod = require('../../src/analysis/findAbsoluteIdsWithoutPaths.js');

describe('analysis/findAbsoluteIdsWithoutPaths', function() {

    it('should not add an error when module ids and filenames are equal', function() {

        var result = {
            scripts: [
                {id: 'a', filename: 'a.js', dependencies: [], type: 'module'},
                {id: 'b', filename: 'b.js', dependencies: [], type: 'module'}
            ],
            errors: [],
            configuration: {}
        };

        testMethod(result);

        expect(result.errors.length).toBe(0);

    });

    it('should not add an error when module ids and filenames only have different cases', function() {

        var result = {
            scripts: [
                {id: 'A', filename: 'a.js', dependencies: [], type: 'module'},
                {id: 'B', filename: 'b.js', dependencies: [], type: 'module'}
            ],
            errors: [],
            configuration: {}
        };

        testMethod(result);

        expect(result.errors.length).toBe(0);

    });

    it('should not add an error when a module id is different from the filename but the id is set in paths', function() {

        var result = {
            scripts: [
                {id: 'moduleA', filename: 'a.js', dependencies: [], type: 'module'},
                {id: 'mapped/b', filename: 'original/b.js', dependencies: [], type: 'module'}
            ],
            errors: [],
            configuration: {
                paths: {
                    'moduleA': 'a',
                    'mapped': 'original'
                }
            }
        };

        testMethod(result);

        expect(result.errors.length).toBe(0);

    });

    it('should not add an error when a module id is different from the filename but a correct pattern is set in paths', function() {

        var result = {
            scripts: [
                {id: 'mapped/a', filename: 'original/a.js', dependencies: [], type: 'module'}
            ],
            errors: [],
            configuration: {
                paths: {
                    'mapped': 'original'
                }
            }
        };

        testMethod(result);

        expect(result.errors.length).toBe(0);

    });

    it('should add an error when a module id is different from the filename and paths is not set at all', function() {

        var result = {
            scripts: [
                {id: 'moduleA', filename: 'a.js', dependencies: [], type: 'module'}
            ],
            errors: [],
            configuration: {}
        };

        testMethod(result);

        expect(result.errors.length).toBe(1);

    });

    it('should add an error when a module id is different from filename and paths is not set correctly', function() {

        var result = {
            scripts: [
                {id: 'mapped/b', filename: 'original/b.js', dependencies: [], type: 'module'}
            ],
            errors: [],
            configuration: {
                paths: {
                    'foo': 'bar'
                }
            }
        };

        testMethod(result);

        expect(result.errors.length).toBe(1);

    });

});
