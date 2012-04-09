'use strict';

var testMethod = require('../../src/analysis/findCircularDependencies.js');

describe('analysis/findCircularDependencies', function() {

    it('should add an error when a module depends on itself', function() {

        var result = {
            modules: {
                'a': {filename: 'a.js', dependencies: ['a']}
            },
            errors: []
        };

        testMethod(result);

        expect(result.errors.length).toBe(1);
    });

    it('should not add an error when no circular dependency is found', function() {

        var result = {
            modules: {
                'a': {filename: 'a.js', dependencies: ['b']},
                'b': {filename: 'b.js', dependencies: []}
            },
            errors: []
        };

        testMethod(result);

        expect(result.errors.length).toBe(0);
    });

    it('should add an error when modules directly depend on each other', function() {

        var result = {
            modules: {
                'a': {filename: 'a.js', dependencies: ['b']},
                'b': {filename: 'b.js', dependencies: ['a']}
            },
            errors: []
        };

        testMethod(result);

        expect(result.errors.length).toBe(1);

    });

    it('should add an error when modules implicitly depend on each other', function() {

        var result = {
            modules: {
                'a': {filename: 'a.js', dependencies: ['b']},
                'b': {filename: 'b.js', dependencies: ['c']},
                'c': {filename: 'c.js', dependencies: ['d', 'e']},
                'd': {filename: 'd.js', dependencies: []},
                'e': {filename: 'e.js', dependencies: ['a']}
            },
            errors: []
        };

        testMethod(result);
    });

    it('should not break when requiring a non existing module', function() {

        var result = {
            modules: {
                'a': {filename: 'a.js', dependencies: ['e']}
            },
            errors: []
        };

        testMethod(result);

        expect(result.errors.length).toBe(0);

    });

});
