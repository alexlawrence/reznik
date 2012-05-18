'use strict';

var testMethod = require('../../src/iteration/forEachDependencyRecursive.js');

describe('iteration/forEachDependencyRecursive', function() {

    it('should not mutate the input object', function() {

        var a = {id: 'a', filename: 'a.js', dependencies: ['b', 'c'] };
        var b = {id: 'b', filename: 'b.js', dependencies: [] };
        var c = {id: 'c', filename: 'c.js', dependencies: ['d'] };
        var d = {id: 'd', filename: 'd.js', dependencies: [] };
        var scripts = [a, b, c, d];

        testMethod(scripts, function() {});

        expect(a.dependencies[0]).toBe('b');
        expect(a.dependencies[1]).toBe('c');
        expect(b.dependencies.length).toBe(0);
        expect(c.dependencies[0]).toBe('d');
        expect(d.dependencies.length).toBe(0);

    });

    it('should call the callback for every direct module dependency', function() {

        var spy = jasmine.createSpy();
        var a = {id: 'a', filename: 'a.js', dependencies: ['b', 'c'] };
        var b = {id: 'b', filename: 'b.js', dependencies: ['c'] };
        var c = {id: 'c', filename: 'c.js', dependencies: [] };
        var scripts = [a, b, c];

        testMethod(scripts, spy);

        expect(spy).toHaveBeenCalledWith(a, 'b');
        expect(spy).toHaveBeenCalledWith(a, 'c');
        expect(spy).toHaveBeenCalledWith(b, 'c');

    });

    it('should call the callback for every implicit module dependency', function() {

        var spy = jasmine.createSpy();
        var a = {id: 'a', filename: 'a.js', dependencies: ['b'] };
        var b = {id: 'b', filename: 'b.js', dependencies: ['c'] };
        var c = {id: 'c', filename: 'c.js', dependencies: ['d'] };
        var d = {id: 'd', filename: 'd.js', dependencies: [] };
        var scripts = [a, b, c, d];

        testMethod(scripts, spy);

        expect(spy).toHaveBeenCalledWith(a, 'b');
        expect(spy).toHaveBeenCalledWith(a, 'c');
        expect(spy).toHaveBeenCalledWith(a, 'd');
        expect(spy).toHaveBeenCalledWith(b, 'c');
        expect(spy).toHaveBeenCalledWith(b, 'd');
        expect(spy).toHaveBeenCalledWith(c, 'd');

    });

    it('should not call the callback for modules without dependencies', function() {

        var spy = jasmine.createSpy();
        var scripts = [
            {id: 'a', filename: 'a.js', dependencies: []},
            {id: 'b', filename: 'b.js', dependencies: []},
            {id: 'c', filename: 'c.js', dependencies: []}
        ];

        testMethod(scripts, spy);

        expect(spy).not.toHaveBeenCalled();

    });

    it('should throw an error when a module depends on itself', function() {

        var scripts = [
            {id: 'a', filename: 'a.js', dependencies: ['a']}
        ];

        expect(function() {
            testMethod(scripts, function() {});
        }).toThrow('circular dependency in a.js');

    });

    it('should not throw an error when a module depends a non existing module', function() {

        var scripts = [
            {id: 'a', filename: 'a.js', dependencies: ['d']}
        ];

        expect(function() {
            testMethod(scripts, function() {});
        }).not.toThrow();

    });

    it('should throw an error when modules depend directly on each other', function() {

        var scripts = [
            {id: 'a', filename: 'a.js', dependencies: ['b']},
            {id: 'b', filename: 'b.js', dependencies: ['a']}
        ];

        expect(function() {
            testMethod(scripts, function() {});
        }).toThrow('circular dependency in a.js');

    });

    it('should throw an error when modules depend implicitly on each other', function() {

        var scripts = [
            {id: 'a', filename: 'a.js', dependencies: ['b']},
            {id: 'b', filename: 'b.js', dependencies: ['c']},
            {id: 'c', filename: 'c.js', dependencies: ['d', 'e']},
            {id: 'd', filename: 'd.js', dependencies: []},
            {id: 'e', filename: 'e.js', dependencies: ['a']}
        ];

        expect(function() {
            testMethod(scripts, function() {});
        }).toThrow('circular dependency in a.js');

    });


});