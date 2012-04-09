'use strict';

var testMethod = require('../../src/reporting/renderPlain.js');

describe('reporting/renderPlain', function() {

    it('should start module information with #files', function() {

        var evaluationResult = {
            modules: {},
            errors: []
        };

        var result = testMethod(evaluationResult);

        expect(result).toMatch(/\s*#files\s*/);
    });

    it('should serialize the filenames of all modules and the corresponding filenames of their dependencies', function() {

        var evaluationResult = {
            modules: {
                'a': {filename:'a.js', dependencies: ['b']},
                'b': {filename:'b.js', dependencies: ['c', 'd']},
                'c': {filename:'c.js', dependencies: ['d']},
                'd': {filename:'d.js', dependencies: []}
            },
            errors: []
        };

        var result = testMethod(evaluationResult);

        expect(result).toMatch(
            /\s*a\.js:b\.js\s*b\.js:c\.js,d\.js\s*c\.js:d\.js\s*d\.js\s*/);
    });

    it('should serialize the correct filenames of modules even when they are different than the module ids', function() {

        var evaluationResult = {
            modules: {
                'a': {filename:'moduleA.js', dependencies: ['b']},
                'b': {filename:'moduleB.js', dependencies: []}
            },
            errors: []
        };

        var result = testMethod(evaluationResult);

        expect(result).toMatch(
            /\s*moduleA\.js:moduleB\.js\s*moduleB\.js:\s*/);
    });

    it('should leave out the filename of a dependency when the dependency is not existing', function() {

        var evaluationResult = {
            modules: {
                'a': {filename:'a.js', dependencies: ['notExisting']},
                'b': {filename:'b.js', dependencies: []}
            },
            errors: []
        };

        var result = testMethod(evaluationResult);

        expect(result).toMatch(
            /\s*a\.js:\s*b\.js:\s*/);
    });

    it('should not serialize the configuration', function() {

        var evaluationResult = {
            configuration: {}
        };

        var result = testMethod(evaluationResult);

        expect(result).not.toMatch(/\s*#configuration\s*/);

    });

    it('should serialize a list of all filenames of anonymous modules', function() {

        var evaluationResult = {
            modules: {
                'a': {filename:'a.js', anonymous: true, dependencies: []},
                'b': {filename:'b.js', anonymous: true, dependencies: []},
                'c': {filename:'c.js', anonymous: false, dependencies: []},
                'd': {filename:'d.js', anonymous: false, dependencies: []}
            },
            errors: []
        };

        var result = testMethod(evaluationResult);

        expect(result).toMatch(/\s*#anonymous\s*a.js\s*b.js\s*/);
    });

    it('should serialize properties starting with "modules" the same way as modules', function() {

        var evaluationResult = {
            modulesFoobar: {
                'a': {filename:'a.js', dependencies: ['b']},
                'b': {filename:'b.js', dependencies: ['c', 'd']},
                'c': {filename:'c.js', dependencies: ['d']},
                'd': {filename:'d.js', dependencies: []}
            },
            errors: []
        };

        var result = testMethod(evaluationResult);

        expect(result).toMatch(
            /\s*#filesFoobar\s*a\.js:b\.js\s*b\.js:c\.js,d\.js\s*c\.js:d\.js\s*d\.js\s*/);
    });

    it('should serialize the errors', function() {

        var evaluationResult = {
            modules: {},
            errors: ['error 1', 'error 2', 'error 3']
        };

        var result = testMethod(evaluationResult);

        expect(result).toMatch(
            /\s*#errors\s*error 1\s*error 2\s*error 3\s*/);

    });

    it('should serialize the information messages', function() {

        var evaluationResult = {
            modules: {},
            errors: [],
            information: ['did something', 'did something else']
        };

        var result = testMethod(evaluationResult);

        expect(result).toMatch(
            /\s*#information\s*did something\s*did something else\s*/);
    });

});