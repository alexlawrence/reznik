'use strict';

var testMethod = require('../../src/transformation/flattenModuleList.js');

describe('transformation/flattenModuleList', function() {

    it('should not change modules without dependencies', function() {

        var modules = {
            a: {dependencies: []},
            b: {dependencies: []},
            c: {dependencies: []},
            d: {dependencies: []}
        };

        var modulesFlattened = testMethod(modules);

        expect(modulesFlattened.a.dependencies.length).toBe(0);
        expect(modulesFlattened.b.dependencies.length).toBe(0);
        expect(modulesFlattened.c.dependencies.length).toBe(0);
        expect(modulesFlattened.d.dependencies.length).toBe(0);

    });

    it('should not change modules with only direct dependencies', function() {

        var modules = {
            a: {dependencies: ['b']},
            b: {dependencies: []},
            c: {dependencies: ['d']},
            d: {dependencies: []}
        };

        var modulesFlattened = testMethod(modules);

        expect(modulesFlattened.a.dependencies.length).toBe(1);
        expect(modulesFlattened.c.dependencies.length).toBe(1);

    });

    it('should add all implicit dependencies to the modules', function() {

        var modules = {
            a: {dependencies: ['b']},
            b: {dependencies: ['c']},
            c: {dependencies: ['d']},
            d: {dependencies: []}
        };

        var modulesFlattened = testMethod(modules);

        expect(modulesFlattened.a.dependencies.length).toBe(3);
        expect(modulesFlattened.a.dependencies[0]).toBe('b');
        expect(modulesFlattened.a.dependencies[1]).toBe('c');
        expect(modulesFlattened.a.dependencies[2]).toBe('d');

    });

    it('should not add duplicates of dependencies to the modules', function() {

        var modules = {
            a: {dependencies: ['b', 'c', 'd']},
            b: {dependencies: ['c']},
            c: {dependencies: ['d']},
            d: {dependencies: []}
        };

        var modulesFlattened = testMethod(modules);

        expect(modulesFlattened.a.dependencies.length).toBe(3);
        expect(modulesFlattened.a.dependencies.occurrencesOf('b')).toBe(1);
        expect(modulesFlattened.a.dependencies.occurrencesOf('c')).toBe(1);
        expect(modulesFlattened.a.dependencies.occurrencesOf('d')).toBe(1);

    });

    it('should return the modules file name', function() {

        var modules = {
            a: {filename: 'a.js', dependencies: [] },
            b: {filename: 'b.js', dependencies: [] },
            c: {filename: 'c.js', dependencies: [] },
            d: {filename: 'd.js', dependencies: [] }
        };

        var modulesFlattened = testMethod(modules);

        expect(modulesFlattened.a.filename).toBe('a.js');
        expect(modulesFlattened.b.filename).toBe('b.js');
        expect(modulesFlattened.c.filename).toBe('c.js');
        expect(modulesFlattened.d.filename).toBe('d.js');

    });

    it('should return the modules anonymous flag', function() {

        var modules = {
            a: {anonymous: true, dependencies: [] },
            b: {anonymous: false, dependencies: [] }
        };

        var modulesFlattened = testMethod(modules);

        expect(modulesFlattened.a.anonymous).toBeTruthy();
        expect(modulesFlattened.b.anonymous).toBeFalsy();
    });

});
