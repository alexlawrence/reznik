'use strict';

var testMethod = require('../../src/iteration/forEachModule.js');

describe('iteration/forEachModule', function() {

    it('should not throw an error when passing undefined', function() {

        expect(testMethod).not.toThrow();

    });

    it('should call the callback for every script with type "module"', function() {

        var spy = jasmine.createSpy();
        var a = {filename: 'a.js', id: 'a', type: 'module'};
        var b = {filename: 'b.js', id: 'a', type: 'module'};
        var scripts = [a, b];

        testMethod(scripts, spy);

        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();

    });

    it('should pass each module and its index to the callback', function() {

        var spy = jasmine.createSpy();
        var a = {filename: 'a.js', id: 'a', type: 'module'};
        var b = {filename: 'b.js', id: 'a', type: 'module'};
        var scripts = [a, b];

        testMethod(scripts, spy);

        expect(spy.argsForCall[0][0]).toBe(a);
        expect(spy.argsForCall[1][0]).toBe(b);

    });

    it('should call the callback for scripts with type "require"', function() {

        var spy = jasmine.createSpy();
        var require = {filename: 'a.js', type: 'require'};
        var scripts = [require];

        testMethod(scripts, spy);

        expect(spy).not.toHaveBeenCalled();

    });


});