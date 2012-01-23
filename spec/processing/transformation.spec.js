'use strict';

require('../../src/common/arrayOccurrencesOf.js');

var subject = require('../../src/processing/transformation.js');

describe('transformation', function() {

    describe('generateInvertedModuleList', function() {

        it('should return inverted direct dependencies', function() {

            var modules = {
                a: {dependencies: ['b', 'c', 'd']},
                b: {dependencies: ['c', 'd']},
                c: {dependencies: ['d']},
                d: {dependencies: []}
            };

            var modulesInverted = subject.generateInvertedModuleList(modules);

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

            var modulesInverted = subject.generateInvertedModuleList(modules);

            expect(modulesInverted.a.dependencies.length).toBe(0);
            expect(modulesInverted.b.dependencies.length).toBe(1);
            expect(modulesInverted.c.dependencies.length).toBe(1);
            expect(modulesInverted.d.dependencies.length).toBe(1);

        });

        it('should return the modules file name', function() {

            var modules = {
                a: {filename: 'a.js' },
                b: {filename: 'b.js' },
                c: {filename: 'c.js' },
                d: {filename: 'd.js' }
            };

            var modulesInverted = subject.generateInvertedModuleList(modules);

            expect(modulesInverted.a.filename).toBe('a.js');
            expect(modulesInverted.b.filename).toBe('b.js');
            expect(modulesInverted.c.filename).toBe('c.js');
            expect(modulesInverted.d.filename).toBe('d.js');

        });

        it('should return the modules anonymous flag', function() {

            var modules = {
                a: {anonymous: true },
                b: {anonymous: false }
            };

            var modulesInverted = subject.generateInvertedModuleList(modules);

            expect(modulesInverted.a.anonymous).toBeTruthy();
            expect(modulesInverted.b.anonymous).toBeFalsy();
        });

    });

    describe('generateFlattenedModuleList', function() {

        it('should not change modules without dependencies', function() {

            var modules = {
                a: {dependencies: []},
                b: {dependencies: []},
                c: {dependencies: []},
                d: {dependencies: []}
            };

            var modulesFlattened = subject.generateFlattenedModuleList(modules);

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

            var modulesFlattened = subject.generateFlattenedModuleList(modules);

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

            var modulesFlattened = subject.generateFlattenedModuleList(modules);

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

            var modulesFlattened = subject.generateFlattenedModuleList(modules);

            expect(modulesFlattened.a.dependencies.length).toBe(3);
            expect(modulesFlattened.a.dependencies.occurrencesOf('b')).toBe(1);
            expect(modulesFlattened.a.dependencies.occurrencesOf('c')).toBe(1);
            expect(modulesFlattened.a.dependencies.occurrencesOf('d')).toBe(1);

        });

        it('should return the modules file name', function() {

            var modules = {
                a: {filename: 'a.js' },
                b: {filename: 'b.js' },
                c: {filename: 'c.js' },
                d: {filename: 'd.js' }
            };

            var modulesFlattened = subject.generateFlattenedModuleList(modules);

            expect(modulesFlattened.a.filename).toBe('a.js');
            expect(modulesFlattened.b.filename).toBe('b.js');
            expect(modulesFlattened.c.filename).toBe('c.js');
            expect(modulesFlattened.d.filename).toBe('d.js');

        });

        it('should return the modules anonymous flag', function() {

            var modules = {
                a: {anonymous: true },
                b: {anonymous: false }
            };

            var modulesFlattened = subject.generateFlattenedModuleList(modules);

            expect(modulesFlattened.a.anonymous).toBeTruthy();
            expect(modulesFlattened.b.anonymous).toBeFalsy();
        });

    });

});