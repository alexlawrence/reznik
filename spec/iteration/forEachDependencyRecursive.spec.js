'use strict';

var testMethod = require('../../src/iteration/forEachDependencyRecursive.js');

describe('iteration/forEachDependencyRecursive', function() {

    it('should not mutate the input object', function() {

        var modules = {
            a: {filename: 'a.js', dependencies: ['b', 'c'] },
            b: {filename: 'b.js', dependencies: [] },
            c: {filename: 'c.js', dependencies: ['d'] },
            d: {filename: 'd.js', dependencies: [] }
        };

        testMethod(modules, function() {});

        expect(modules.a.dependencies[0]).toBe('b');
        expect(modules.a.dependencies[1]).toBe('c');
        expect(modules.b.dependencies.length).toBe(0);
        expect(modules.c.dependencies[0]).toBe('d');
        expect(modules.d.dependencies.length).toBe(0);

    });

    it('should call the callback for every direct module dependency', function() {

        var spy = jasmine.createSpy();
        var modules = {
            a: {filename: 'a.js', dependencies: ['b', 'c'] },
            b: {filename: 'b.js', dependencies: ['c'] },
            c: {filename: 'c.js', dependencies: [] }
        };

        testMethod(modules, spy);

        expect(spy).toHaveBeenCalledWith('a', 'b');
        expect(spy).toHaveBeenCalledWith('a', 'c');
        expect(spy).toHaveBeenCalledWith('b', 'c');

    });

    it('should call the callback for every implicit module dependency', function() {

        var spy = jasmine.createSpy();
        var modules = {
            a: {filename: 'a.js', dependencies: ['b'] },
            b: {filename: 'b.js', dependencies: ['c'] },
            c: {filename: 'c.js', dependencies: ['d'] },
            d: {filename: 'd.js', dependencies: [] }
        };

        testMethod(modules, spy);

        expect(spy).toHaveBeenCalledWith('a', 'b');
        expect(spy).toHaveBeenCalledWith('a', 'c');
        expect(spy).toHaveBeenCalledWith('a', 'd');
        expect(spy).toHaveBeenCalledWith('b', 'c');
        expect(spy).toHaveBeenCalledWith('b', 'd');
        expect(spy).toHaveBeenCalledWith('c', 'd');

    });

    it('should not call the callback for modules without dependencies', function() {

        var spy = jasmine.createSpy();
        var modules = {
            a: {filename: 'a.js', dependencies: []},
            b: {filename: 'b.js', dependencies: []},
            c: {filename: 'c.js', dependencies: []}
        };

        testMethod(modules, spy);

        expect(spy).not.toHaveBeenCalled();

    });

    it('should throw an error when a module depends on itself', function() {

        var modules = {
            'a': {filename: 'a.js', dependencies: ['a']}
        };

        expect(function() {
            testMethod(modules, function() {});
        }).toThrow('circular dependency in a.js');

    });

    it('should not throw an error when a module depends a non existing module', function() {

        var modules = {
            'a': {filename: 'a.js', dependencies: ['d']}
        };

        expect(function() {
            testMethod(modules, function() {});
        }).not.toThrow();

    });

    it('should throw an error when modules depend directly on each other', function() {

        var modules = {
            'a': {filename: 'a.js', dependencies: ['b']},
            'b': {filename: 'b.js', dependencies: ['a']}
        };

        expect(function() {
            testMethod(modules, function() {});
        }).toThrow('circular dependency in a.js');

    });

    it('should throw an error when modules depend implicitly on each other', function() {

        var modules = {
            'a': {filename: 'a.js', dependencies: ['b']},
            'b': {filename: 'b.js', dependencies: ['c']},
            'c': {filename: 'c.js', dependencies: ['d', 'e']},
            'd': {filename: 'd.js', dependencies: []},
            'e': {filename: 'e.js', dependencies: ['a']}
        };

        expect(function() {
            testMethod(modules, function() {});
        }).toThrow('circular dependency in a.js');

    });


});