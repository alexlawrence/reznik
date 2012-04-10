'use strict';

var testMethod = require('../../src/analysis/findAbsoluteIdsWithoutPaths.js');

describe('analysis/findAbsoluteIdsWithoutPaths', function() {

    it('should not add an error when module ids and filenames are equal', function() {

        var result = {
            modules: {
                'a': {filename: 'a.js', dependencies: []},
                'b': {filename: 'b.js', dependencies: []}
            },
            errors: [],
            configuration: {}
        };

        testMethod(result);

        expect(result.errors.length).toBe(0);

    });

    it('should not add an error when module ids and filenames only have different cases', function() {

        var result = {
            modules: {
                'A': {filename: 'a.js', dependencies: []},
                'B': {filename: 'b.js', dependencies: []}
            },
            errors: [],
            configuration: {}
        };

        testMethod(result);

        expect(result.errors.length).toBe(0);

    });

    it('should not add an error when a module id is different from the filename but the id is set in paths', function() {

        var result = {
            modules: {
                'moduleA': {filename: 'a.js', dependencies: []},
                'mapped/b': {filename: 'original/b.js', dependencies: []}
            },
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
            modules: {
                'mapped/a': {filename: 'original/a.js', dependencies: []}
            },
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
            modules: {
                'moduleA': {filename: 'a.js', dependencies: []}
            },
            errors: [],
            configuration: {}
        };

        testMethod(result);

        expect(result.errors.length).toBe(1);

    });

    it('should add an error when a module id is different from filename and paths is not set correctly', function() {

        var result = {
            modules: {
                'mapped/b': {filename: 'original/b.js', dependencies: []}
            },
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
