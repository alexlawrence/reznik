'use strict';

var testMethod = require('../../src/transformation/invertModuleList.js');

describe('transformation/invertModuleList', function() {

    it('should return inverted direct dependencies', function() {

        var modules = {
            a: {dependencies: ['b', 'c', 'd']},
            b: {dependencies: ['c', 'd']},
            c: {dependencies: ['d']},
            d: {dependencies: []}
        };

        var modulesInverted = testMethod(modules);

        expect(modulesInverted.a.dependencies.length).toBe(0);
        expect(modulesInverted.b.dependencies.length).toBe(1);
        expect(modulesInverted.c.dependencies.length).toBe(2);
        expect(modulesInverted.d.dependencies.length).toBe(3);

    });

    it('should not return inverted implicit dependencies', function() {

        var modules = {
            a: {dependencies: ['b'] },
            b: {dependencies: ['c'] },
            c: {dependencies: ['d'] },
            d: {dependencies: [] }
        };

        var modulesInverted = testMethod(modules);

        expect(modulesInverted.a.dependencies.length).toBe(0);
        expect(modulesInverted.b.dependencies.length).toBe(1);
        expect(modulesInverted.c.dependencies.length).toBe(1);
        expect(modulesInverted.d.dependencies.length).toBe(1);

    });

    it('should return the modules file name', function() {

        var modules = {
            a: {filename: 'a.js', dependencies: [] },
            b: {filename: 'b.js', dependencies: [] },
            c: {filename: 'c.js', dependencies: [] },
            d: {filename: 'd.js', dependencies: [] }
        };

        var modulesInverted = testMethod(modules);

        expect(modulesInverted.a.filename).toBe('a.js');
        expect(modulesInverted.b.filename).toBe('b.js');
        expect(modulesInverted.c.filename).toBe('c.js');
        expect(modulesInverted.d.filename).toBe('d.js');

    });

    it('should return the modules anonymous flag', function() {

        var modules = {
            a: {anonymous: true, dependencies: [] },
            b: {anonymous: false, dependencies: [] }
        };

        var modulesInverted = testMethod(modules);

        expect(modulesInverted.a.anonymous).toBeTruthy();
        expect(modulesInverted.b.anonymous).toBeFalsy();
    });

});