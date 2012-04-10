'use strict';

var testMethod = require('../../src/iteration/forSomeModules.js');

describe('iteration/forSomeModules', function() {

    it('should not throw an error when passing undefined', function() {

        expect(testMethod).not.toThrow();

    });

    it('should call the callback for every module as long as the callback does not return true', function() {

        var spy = jasmine.createSpy();
        var modules = { a: {}, b: {}, c: {} };

        testMethod(modules, spy);

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

        testMethod(modules, spy);

        expect(spy).toHaveBeenCalledWith('a', moduleDataA);
        expect(spy).toHaveBeenCalledWith('b', moduleDataB);
        expect(spy).toHaveBeenCalledWith('c', moduleDataC);

    });

    it('should abort the iteration when callback returns true', function() {

        var timesCalled = 0;
        var modules = { a: {}, c: {}, b: {} };

        testMethod(modules, function() {
            timesCalled++;
            if (timesCalled === 2) {
                return true;
            }
        });

        expect(timesCalled).toBe(2);

    });

});