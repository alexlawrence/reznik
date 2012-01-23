'use strict';

var subject = require('../../src/processing/iteration.js');

describe('iteration', function() {

    describe('forEachModule', function() {

        it('should call the callback for every given module', function() {

            var spy = jasmine.createSpy();
            var modules = { a: {}, b: {}, c: {} };
            
            subject.forEachModule(modules, spy);

            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalled();

        });

        it('should pass the id and the module data to the callback', function() {

            var spy = jasmine.createSpy();
            var moduleDataA = {
                filename: 'a.js',
                dependencies: ['b'],
                anonymous: false
            };
            var moduleDataB = {
                filename: 'b.js',
                dependencies: ['c'],
                anonymous: false
            };
            var moduleDataC = {
                filename: 'c.js',
                dependencies: ['a', 'd'],
                anonymous: true
            };
            var modules = {
                a: moduleDataA,
                b: moduleDataB,
                c: moduleDataC
            };

            subject.forEachModule(modules, spy);

            expect(spy).toHaveBeenCalledWith('a', moduleDataA);
            expect(spy).toHaveBeenCalledWith('b', moduleDataB);
            expect(spy).toHaveBeenCalledWith('c', moduleDataC);

        });

        it('should pass an empty dependency array to the callback when dependencies are undefined', function() {

            var spy = jasmine.createSpy();
            var modules = { a: {}, b: { dependencies: undefined } };

            subject.forEachModule(modules, spy);

            expect(spy).toHaveBeenCalledWith('a', {dependencies: []});
            expect(spy).toHaveBeenCalledWith('b', {dependencies: []});

        });

        it('should abort iteration when callback returns true', function() {

            var timesCalled = 0;
            var modules = { a: {}, c: {}, b: {} };

            subject.forEachModule(modules, function() {
                timesCalled++;
                if (timesCalled === 2) {
                    return true;
                }
            });

            expect(timesCalled).toBe(2);

        });

    });

    describe('forEachModuleDependencyRecursive', function() {

        it('should not mutate the input object', function() {

            var modules = {
                a: { dependencies: ['b', 'c'] },
                b: { dependencies: [] },
                c: { dependencies: ['d'] },
                d: { dependencies: [] }
            };

            subject.forEachModuleDependencyRecursive(modules, function() {});

            expect(modules.a.dependencies[0]).toBe('b');
            expect(modules.a.dependencies[1]).toBe('c');
            expect(modules.b.dependencies.length).toBe(0);
            expect(modules.c.dependencies[0]).toBe('d');
            expect(modules.d.dependencies.length).toBe(0);

        });

        it('should call the callback for every direct module dependency', function() {

            var spy = jasmine.createSpy();
            var modules = {
                a: { dependencies: ['b', 'c'] },
                b: { dependencies: ['c'] },
                c: { dependencies: [] }
            };

            subject.forEachModuleDependencyRecursive(modules, spy);

            expect(spy).toHaveBeenCalledWith('a', 'b');
            expect(spy).toHaveBeenCalledWith('a', 'c');
            expect(spy).toHaveBeenCalledWith('b', 'c');

        });

        it('should call the callback for every implicit module dependency', function() {

            var spy = jasmine.createSpy();
            var modules = {
                a: { dependencies: ['b'] },
                b: { dependencies: ['c'] },
                c: { dependencies: ['d'] },
                d: { dependencies: [] }
            };

            subject.forEachModuleDependencyRecursive(modules, spy);

            expect(spy).toHaveBeenCalledWith('a', 'b');
            expect(spy).toHaveBeenCalledWith('a', 'c');
            expect(spy).toHaveBeenCalledWith('a', 'd');
            expect(spy).toHaveBeenCalledWith('b', 'c');
            expect(spy).toHaveBeenCalledWith('b', 'd');
            expect(spy).toHaveBeenCalledWith('c', 'd');

        });

        it('should not call the callback for modules without dependencies', function() {

            var spy = jasmine.createSpy();
            var modules = { a: {}, b: {}, c: {} };

            subject.forEachModuleDependencyRecursive(modules, spy);

            expect(spy).not.toHaveBeenCalled();

        });

        it('should throw an error when a module depends on itself', function() {

            var modules = {'a': {dependencies: ['a']}};

            expect(function() {
                subject.forEachModuleDependencyRecursive(modules, function() {});
            }).toThrow('circular dependency in a');

        });

        it('should not throw an error when a module depends a non existing module', function() {

            var modules = {'a': {dependencies: ['d']}};

            expect(function() {
                subject.forEachModuleDependencyRecursive(modules, function() {});
            }).not.toThrow();

        });

        it('should throw an error when modules depend directly on each other', function() {

            var modules = {
                'a': {dependencies: ['b']},
                'b': {dependencies: ['a']}
            };

            expect(function() {
                subject.forEachModuleDependencyRecursive(modules, function() {});
            }).toThrow('circular dependency in a');

        });

        it('should throw an error when modules depend implicitly on each other', function() {

            var modules = {
                'a': {dependencies: ['b']},
                'b': {dependencies: ['c']},
                'c': {dependencies: ['d', 'e']},
                'd': {dependencies: []},
                'e': {dependencies: ['a']}
            };

            expect(function() {
                subject.forEachModuleDependencyRecursive(modules, function() {});
            }).toThrow('circular dependency in a');

        });


    });

});