'use strict';

var testMethod = require('../../src/analysis/findCircularDependencies.js');

describe('analysis/findCircularDependencies', function() {

    it('should add an error when a module depends on itself', function() {

        var result = {
            scripts: [
                {id: 'a', filename: 'a.js', dependencies: ['a'], type: 'module'}
            ],
            errors: []
        };

        testMethod(result);

        expect(result.errors.length).toBe(1);
    });

    it('should not add an error when no circular dependency is found', function() {

        var result = {
            scripts: [
                {id: 'a', filename: 'a.js', dependencies: ['b'], type: 'module'},
                {id: 'b', filename: 'b.js', dependencies: [], type: 'module'}
            ],
            errors: []
        };

        testMethod(result);

        expect(result.errors.length).toBe(0);
    });

    it('should add an error when modules directly depend on each other', function() {

        var result = {
            scripts: [
                {id: 'a', filename: 'a.js', dependencies: ['b'], type: 'module'},
                {id: 'b', filename: 'b.js', dependencies: ['a'], type: 'module'}
            ],
            errors: []
        };

        testMethod(result);

        expect(result.errors.length).toBe(1);

    });

    it('should add an error when modules implicitly depend on each other', function() {

        var result = {
            scripts: [
                {id: 'a', filename: 'a.js', dependencies: ['b'], type: 'module'},
                {id: 'b', filename: 'b.js', dependencies: ['c'], type: 'module'},
                {id: 'c', filename: 'c.js', dependencies: ['d', 'e'], type: 'module'},
                {id: 'd', filename: 'd.js', dependencies: [], type: 'module'},
                {id: 'e', filename: 'e.js', dependencies: ['a'], type: 'module'}
            ],
            errors: []
        };

        testMethod(result);
    });

    it('should not break when requiring a non existing module', function() {

        var result = {
            scripts: [
                {id: 'a', filename: 'a.js', dependencies: ['e'], type: 'module'}
            ],
            errors: []
        };

        testMethod(result);

        expect(result.errors.length).toBe(0);

    });

});
