'use strict';

require('../../src/common/arrayOccurrencesOf.js');

var subject = require('../../src/processing/transformation.js');

describe('flatten', function() {

    describe('generateInvertedModuleList', function() {

        it('should return inverted direct dependencies', function() {

            var modules = { a: ['b', 'c', 'd'], b: ['c', 'd'], c: ['d'], d: [] };

            var modulesInverted = subject.generateInvertedModuleList(modules);

            expect(modulesInverted.a.length).toBe(0);
            expect(modulesInverted.b.length).toBe(1);
            expect(modulesInverted.c.length).toBe(2);
            expect(modulesInverted.d.length).toBe(3);

        });

        it('should not return inverted implicit dependencies', function() {

            var modules = { a: ['b'], b: ['c'], c: ['d'], d: [] };

            var modulesInverted = subject.generateInvertedModuleList(modules);

            expect(modulesInverted.a.length).toBe(0);
            expect(modulesInverted.b.length).toBe(1);
            expect(modulesInverted.c.length).toBe(1);
            expect(modulesInverted.d.length).toBe(1);

        });

    });

    describe('generateFlattenedModuleList', function() {

        it('should not change modules without dependencies', function() {

            var modules = { a: [], b: [], c: [], d: [] };

            var modulesFlattened = subject.generateFlattenedModuleList(modules);

            expect(modulesFlattened.a.length).toBe(0);
            expect(modulesFlattened.b.length).toBe(0);
            expect(modulesFlattened.c.length).toBe(0);
            expect(modulesFlattened.d.length).toBe(0);

        });

        it('should not change modules with only direct dependencies', function() {

            var modules = { a: ['b'], b: [], c: ['d'], d: [] };

            var modulesFlattened = subject.generateFlattenedModuleList(modules);

            expect(modulesFlattened.a.length).toBe(1);
            expect(modulesFlattened.c.length).toBe(1);

        });

        it('should add all implicit dependencies to the modules', function() {

            var modules = { a: ['b'], b: ['c'], c: ['d'], d: [] };

            var modulesFlattened = subject.generateFlattenedModuleList(modules);

            expect(modulesFlattened.a.length).toBe(3);
            expect(modulesFlattened.a[0]).toBe('b');
            expect(modulesFlattened.a[1]).toBe('c');
            expect(modulesFlattened.a[2]).toBe('d');

        });

        it('should not add duplicates of dependencies to the modules', function() {

            var modules = { a: ['b', 'c', 'd'], b: ['c'], c: ['d'], d: [] };

            var modulesFlattened = subject.generateFlattenedModuleList(modules);

            expect(modulesFlattened.a.length).toBe(3);
            expect(modulesFlattened.a.occurrencesOf('b')).toBe(1);
            expect(modulesFlattened.a.occurrencesOf('c')).toBe(1);
            expect(modulesFlattened.a.occurrencesOf('d')).toBe(1);

        });

    });

});