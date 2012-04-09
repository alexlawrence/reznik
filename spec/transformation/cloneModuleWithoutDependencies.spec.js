'use strict';

var testMethod = require('../../src/transformation/cloneModuleWithoutDependencies.js');

describe('transformation/cloneModule', function() {

    var result;
    var input = {
        id: 'id',
        filename: 'filename',
        anonymous: true,
        dependencies: ['1', '2', '3']
    };

    beforeEach(function() {
        result = testMethod(input);
    });

    it('should clone the id of the given module', function() {
        expect(result.id).toBe(input.id);
    });

    it('should clone the filename of the given module', function() {
        expect(result.filename).toBe(input.filename);
    });

    it('should clone the anonymous flag of the given module', function() {
        expect(result.anonymous).toBe(input.anonymous);
    });

    it('should not clone the dependencies of the given module', function() {
        expect(result.dependencies.length).toBe(0);
    });

});