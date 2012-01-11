var subject = require('../src/flatten.js');

describe('flatten', function() {

    describe('flattenDependencies', function() {

        it('should not change modules without dependencies', function() {

            var modules = { a: [], b: [], c: [], d: [] };

            subject.flattenDependencies(modules);

            expect(modules.a.length).toBe(0);
            expect(modules.b.length).toBe(0);
            expect(modules.c.length).toBe(0);
            expect(modules.d.length).toBe(0);

        });

        it('should not change modules with only direct dependencies', function() {

            var modules = { a: ['b'], b: [], c: ['d'], d: [] };

            subject.flattenDependencies(modules);

            expect(modules.a.length).toBe(1);
            expect(modules.c.length).toBe(1);

        });

        it('should add all implicit dependencies to the modules', function() {

            var modules = { a: ['b'], b: ['c'], c: ['d'], d: [] };

            subject.flattenDependencies(modules);

            expect(modules.a.length).toBe(3);
            expect(modules.a[0]).toBe('b');
            expect(modules.a[1]).toBe('c');
            expect(modules.a[2]).toBe('d');

        });

    });

});