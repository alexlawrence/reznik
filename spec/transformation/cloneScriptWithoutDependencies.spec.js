'use strict';

var testMethod = require('../../src/transformation/cloneScriptWithoutDependencies.js');

describe('transformation/cloneScriptWithoutDependencies', function() {

    var result;
    var input = {id: 'id', filename: 'file', anonymous: true, dependencies: ['1', '2', '3'], type: 'module'};

    beforeEach(function() {
        result = testMethod(input);
    });

    it('should clone the id of the given script', function() {
        expect(result.id).toBe(input.id);
    });

    it('should clone the filename of the given script', function() {
        expect(result.filename).toBe(input.filename);
    });

    it('should clone the anonymous flag of the given script', function() {
        expect(result.anonymous).toBe(input.anonymous);
    });

    it('should clone the type of the given script', function() {
        expect(result.type).toBe(input.type);
    });

    it('should not clone the dependencies but create an empty array', function() {
        expect(Array.isArray(result.dependencies)).toBeTruthy();
        expect(result.dependencies.length).toBe(0);
    });

});