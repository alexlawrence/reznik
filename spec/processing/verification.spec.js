'use strict';

var subject = require('../../src/processing/verification.js');

describe('verification', function() {

    describe('checkMissingDependencies', function() {

        it('should not add an error when no modules are available', function() {

            var result = {
                modules: {},
                errors: []
            };

            subject.checkMissingDependencies(result);

            expect(result.errors.length).toBe(0);
        });

        it('should not add an error when all dependencies are available', function() {

            var result = {
                modules: {
                    'a': {dependencies: ['b', 'c']},
                    'b': {dependencies: ['c']},
                    'c': {dependencies: []}
                },
                errors: []
            };

            subject.checkMissingDependencies(result);

            expect(result.errors.length).toBe(0);
        });

        it('should add an error when a module´s dependency is undefined', function() {

            var result = {
                modules: {
                    'a': {dependencies: ['b']},
                    'b': {dependencies: ['c']}
                },
                errors: []
            };

            subject.checkMissingDependencies(result);

            expect(result.errors[0]).toBe('missing dependency c required in b.js');
            expect(result.errors.length).toBe(1);
        });

    });

    describe('checkCircularDependencies', function() {

        it('should add an error when a module depends on itself', function() {

            var result = {
                modules: {
                    'a': {dependencies: ['a']}
                },
                errors: []
            };

            subject.checkCircularDependencies(result);

            expect(result.errors[0]).toBe('circular dependency in a.js');
            expect(result.errors.length).toBe(1);

        });

        it('should add an error when modules directly depend on each other', function() {

            var result = {
                modules: {
                    'a': {dependencies: ['b']},
                    'b': {dependencies: ['a']}
                },
                errors: []
            };

            subject.checkCircularDependencies(result);

            expect(result.errors[0]).toBe('circular dependency in a.js');
            expect(result.errors.length).toBe(1);

        });

        it('should add an error when modules implicitly depend on each other', function() {

            var result = {
                modules: {
                    'a': {dependencies: ['b']},
                    'b': {dependencies: ['c']},
                    'c': {dependencies: ['d', 'e']},
                    'd': {dependencies: []},
                    'e': {dependencies: ['a']}
                },
                errors: []
            };

            subject.checkCircularDependencies(result);

            expect(result.errors[0]).toBe('circular dependency in a.js');

        });

        it('should not break when requiring a non existing module', function() {

            var result = {
                modules: {
                    'a': {dependencies: ['e']}
                },
                errors: []
            };

            subject.checkCircularDependencies(result);

            expect(result.errors.length).toBe(0);

        });

    });

});