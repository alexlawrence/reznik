'use strict';

var testMethod = require('../../src/iteration/forEachModule.js');

describe('iteration/forEachModule', function() {

    it('should not throw an error when passing undefined', function() {

        expect(testMethod).not.toThrow();

    });

    it('should call the callback for every module', function() {

        var spy = jasmine.createSpy();
        var modules = { a: {}, b: {}, c: {} };

        testMethod(modules, spy);

        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();

    });


});