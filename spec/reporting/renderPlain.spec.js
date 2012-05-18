'use strict';

var testMethod = require('../../src/reporting/renderPlain.js');

describe('reporting/renderPlain', function() {

    it('should start scripts information with #files', function() {

        var evaluationResult = {
            scripts: [],
            errors: []
        };

        var result = testMethod(evaluationResult);

        expect(result).toMatch(/\s*#files\s*/);
    });

    it('should serialize the filenames of all scripts and the corresponding filenames of their dependencies', function() {

        var evaluationResult = {
            scripts: [
                {filename:'a.js', dependencies: ['b'], type: 'require'},
                {id: 'b', filename:'b.js', dependencies: ['c', 'd'], type: 'module'},
                {id: 'c', filename:'c.js', dependencies: ['d'], type: 'module'},
                {id: 'd', filename:'d.js', dependencies: [], type: 'module'}
            ],
            errors: []
        };

        var result = testMethod(evaluationResult);

        expect(result).toMatch(
            /\s*a\.js:b\.js\s*b\.js:c\.js,d\.js\s*c\.js:d\.js\s*d\.js\s*/);
    });

    it('should serialize the correct filenames of scripts even when they are different than the module ids', function() {

        var evaluationResult = {
            scripts: [
                {id: 'a', filename:'moduleA.js', dependencies: ['b'], type: 'module'},
                {id: 'b', filename:'moduleB.js', dependencies: [], type: 'module'}
            ],
            errors: []
        };

        var result = testMethod(evaluationResult);

        expect(result).toMatch(
            /\s*moduleA\.js:moduleB\.js\s*moduleB\.js:\s*/);
    });

    it('should leave out the filename of a dependency when the dependency is not existing', function() {

        var evaluationResult = {
            scripts: [
                {id: 'a', filename:'a.js', dependencies: ['notExisting'], type: 'module'},
                {id: 'b', filename:'b.js', dependencies: [], type: 'module'}
            ],
            errors: []
        };

        var result = testMethod(evaluationResult);

        expect(result).toMatch(
            /\s*a\.js:\s*b\.js:\s*/);
    });

    it('should not serialize the configuration', function() {

        var evaluationResult = {
            scripts: [],
            configuration: {}
        };

        var result = testMethod(evaluationResult);

        expect(result).not.toMatch(/\s*#configuration\s*/);

    });

    it('should serialize a list of all filenames of anonymous modules', function() {

        var evaluationResult = {
            scripts: [
                {id: 'a', filename:'a.js', type: 'module', anonymous: true, dependencies: []},
                {id: 'b', filename:'b.js', type: 'module', anonymous: true, dependencies: []},
                {id: 'c', filename:'c.js', type: 'module', anonymous: false, dependencies: []},
                {id: 'd', filename:'d.js', type: 'module', anonymous: false, dependencies: []}
            ],
            errors: []
        };

        var result = testMethod(evaluationResult);

        expect(result).toMatch(/\s*#anonymous\s*a.js\s*b.js\s*/);
    });

    it('should serialize properties starting with "scripts" the same way as scripts', function() {

        var evaluationResult = {
            scriptsFoobar: [
                {id: 'a', filename:'a.js', dependencies: ['b'], type: 'module'},
                {id: 'b', filename:'b.js', dependencies: ['c', 'd'], type: 'module'},
                {id: 'c', filename:'c.js', dependencies: ['d'], type: 'module'},
                {id: 'd', filename:'d.js', dependencies: [], type: 'module'}
            ],
            scripts: [],
            errors: []
        };

        var result = testMethod(evaluationResult);

        expect(result).toMatch(
            /\s*#filesFoobar\s*a\.js:b\.js\s*b\.js:c\.js,d\.js\s*c\.js:d\.js\s*d\.js\s*/);
    });

    it('should serialize the errors', function() {

        var evaluationResult = {
            scripts: [],
            errors: ['error 1', 'error 2', 'error 3']
        };

        var result = testMethod(evaluationResult);

        expect(result).toMatch(
            /\s*#errors\s*error 1\s*error 2\s*error 3\s*/);

    });

    it('should serialize the information messages', function() {

        var evaluationResult = {
            scripts: [],
            errors: [],
            information: ['did something', 'did something else']
        };

        var result = testMethod(evaluationResult);

        expect(result).toMatch(
            /\s*#information\s*did something\s*did something else\s*/);
    });

});