var subject = require('../src/verification.js');

describe('verification', function() {

    describe('checkMissingDependencies', function() {

        it('should not add an error to the evaluation result when no modules available', function() {

            var result = {
                modules: {},
                errors: []
            };

            subject.checkMissingDependencies(result);

            expect(result.errors.length).toBe(0);
        });

        it('should add an error to the evaluation result when a module´s dependency is undefined', function() {

            var result = {
                modules: {'a': ['b']},
                errors: []
            };

            subject.checkMissingDependencies(result);

            expect(result.errors[0]).toBe('missing dependency b required in a.js');
        });

    });

    describe('checkCircularDependencies', function() {

        it('should add an error when a module depends on itself', function() {

            var result = {
                modules: {'a': ['a']},
                errors: []
            };

            subject.checkCircularDependencies(result);

            expect(result.errors[0]).toBe('circular dependency in a.js');

        });

        it('should add an error when modules depend directly on each other', function() {

            var result = {
                modules: {'a': ['b'], 'b': ['a']},
                errors: []
            };

            subject.checkCircularDependencies(result);

            expect(result.errors[0]).toBe('circular dependency in a.js');

        });

        it('should add an error when modules depend implicitly on each other', function() {

            var result = {
                modules: {'a': ['b'], 'b': ['c'], 'c': ['d', 'e'], 'd': [], 'e': ['a']},
                errors: []
            };

            subject.checkCircularDependencies(result);

            expect(result.errors[0]).toBe('circular dependency in a.js');

        });

        it('should not break when requiring a non existing module', function() {

            var result = {
                modules: {'a': ['e']},
                errors: []
            };

            subject.checkCircularDependencies(result);

            expect(result.errors.length).toBe(0);

        });

    });

});