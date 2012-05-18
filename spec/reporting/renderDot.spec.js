'use strict';

var testMethod = require('../../src/reporting/renderDot.js');

describe('reporting/renderDot', function() {

    it('should return the correct dot format', function() {

        var evaluationResult = {
            scripts: [],
            errors: []
        };

        var result = testMethod(evaluationResult);

        expect(result).toContain('digraph dependencies');

    });

    it('should serialize require scripts correctly', function() {

        var evaluationResult = {
            scripts: [
                {filename: 'm/a.js', dependencies: ['m/b'], type: 'require'}
            ],
            errors: []
        };

        var result = testMethod(evaluationResult);

        expect(result).toContain('"m/a.js" -> "m/b";');

    });

    it('should serialize modules with dependencies correctly', function() {

        var evaluationResult = {
            scripts: [
                {id: 'm/a', filename: 'm/a.js', dependencies: ['m/b'], type: 'module'},
                {id: 'm/b', filename: 'm/b.js', dependencies: ['m/c', 'm/d'], type: 'module'},
                {id: 'm/c', filename: 'm/c.js', dependencies: ['m/d'], type: 'module'},
                {id: 'm/d', filename: 'm/d.js', dependencies: [], type: 'module'}
            ],
            errors: []
        };

        var result = testMethod(evaluationResult);

        expect(result).toContain('"m/a" -> "m/b";');
        expect(result).toContain('"m/b" -> "m/c";');
        expect(result).toContain('"m/b" -> "m/d";');
        expect(result).toContain('"m/c" -> "m/d";');

    });

    it('should serialize modules without dependencies correctly', function() {

        var evaluationResult = {
            scripts: [
                {id: 'm/a', filename: 'm/a.js', dependencies: [], type: 'module'}
            ],
            errors: []
        };

        var result = testMethod(evaluationResult);

        expect(result).toContain('"m/a";');
    });

});
