var subject = require('../src/iteration.js');

describe('iteration', function() {

    describe('forEachModule', function() {

        it('should call the callback for every given module', function() {

            var spy = jasmine.createSpy();
            var modules = { a: null, b: null, c: null };
            
            subject.forEachModule(modules, spy);

            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalled();

        });

        it('should pass module id and dependency id array as arguments to the callback', function() {

            var spy = jasmine.createSpy();
            var modules = { a: ['b'], b: ['c'], c: ['a', 'd'] };

            subject.forEachModule(modules, spy);

            expect(spy).toHaveBeenCalledWith('a', ['b']);
            expect(spy).toHaveBeenCalledWith('b', ['c']);
            expect(spy).toHaveBeenCalledWith('c', ['a', 'd']);

        });

        it('should pass an empty dependency array to the callback when input is undefined', function() {

            var spy = jasmine.createSpy();
            var modules = { a: null, b: undefined };

            subject.forEachModule(modules, spy);

            expect(spy).toHaveBeenCalledWith('a', []);
            expect(spy).toHaveBeenCalledWith('b', []);

        });

        it('should abort iteration when callback returns true', function() {

            var timesCalled = 0;
            var firstTime = true;
            var modules = { a: null, c: null, b: undefined };

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

            var modules = { a: ['b', 'c'], b: [], c: ['d'], d: [] };

            subject.forEachModuleDependencyRecursive(modules, function() {});

            expect(modules.a[0]).toBe('b');
            expect(modules.a[1]).toBe('c');
            expect(modules.b.length).toBe(0);
            expect(modules.c[0]).toBe('d');
            expect(modules.d.length).toBe(0);

        });

        it('should call the callback for every direct module dependency', function() {

            var spy = jasmine.createSpy();
            var modules = { a: ['b', 'c'], b: ['c'], c: [] };

            subject.forEachModuleDependencyRecursive(modules, spy);

            expect(spy).toHaveBeenCalledWith('a', 'b');
            expect(spy).toHaveBeenCalledWith('a', 'c');
            expect(spy).toHaveBeenCalledWith('b', 'c');

        });

        it('should call the callback for every implicit module dependency', function() {

            var spy = jasmine.createSpy();
            var modules = { a: ['b'], b: ['c'], c: ['d'], d: [] };

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
            var modules = { a: [], b: [], c: [] };

            subject.forEachModuleDependencyRecursive(modules, spy);

            expect(spy).not.toHaveBeenCalled();

        });

        it('should throw an error when a module depends on itself', function() {

            var modules = {'a': ['a']};

            expect(function() {
                subject.forEachModuleDependencyRecursive(modules, function() {});
            }).toThrow('circular dependency in a');

        });

        it('should throw an error when modules depend directly on each other', function() {

            var modules = {'a': ['b'], 'b': ['a']};

            expect(function() {
                subject.forEachModuleDependencyRecursive(modules, function() {});
            }).toThrow('circular dependency in a');

        });

        it('should throw an error when modules depend implicitly on each other', function() {

            var modules = {'a': ['b'], 'b': ['c'], 'c': ['d', 'e'], 'd': [], 'e': ['a']};

            expect(function() {
                subject.forEachModuleDependencyRecursive(modules, function() {});
            }).toThrow('circular dependency in a');

        });


    });

});