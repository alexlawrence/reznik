var when = require('../../src/common/when.js');
var Deferred = require('../../src/common/Deferred.js');

describe('common/when', function() {

    it('should return a new deferred', function() {
        expect(typeof when().then).toBe('function');
    });

    describe('when given no deferred or an empty array', function() {

        var spyUndefined, spyArray;

        beforeEach(function() {
            spyUndefined = jasmine.createSpy('when().then');
            when().then(spyUndefined);

            spyArray = jasmine.createSpy('when([]).then');
            when([]).then(spyArray);
        });

        it('should resolve the returned deferred immediately', function() {
            expect(spyUndefined).toHaveBeenCalled();
            expect(spyArray).toHaveBeenCalled();
        });

        it('should pass no arguments to the success handler', function() {
            expect(spyUndefined).toHaveBeenCalledWith();
            expect(spyArray).toHaveBeenCalledWith();
        });

    });

    describe('when given one deferred', function() {

        var spy, passedDeferred;

        beforeEach(function() {
            spy = jasmine.createSpy('when(deferred).then()');
            passedDeferred = new Deferred();
            when(passedDeferred).then(spy);
        });

        it('should resolve the returned deferred when the passed deferred is resolved', function() {
            passedDeferred.resolve();

            expect(spy).toHaveBeenCalled();
        });

        it('should pass all arguments of the passed deferred to the returned deferred success handler as array', function() {
            var firstArgument = {}, secondArgument = [];
            passedDeferred.resolve(firstArgument, secondArgument);

            expect(spy.argsForCall[0][0][0]).toBe(firstArgument);
            expect(spy.argsForCall[0][0][1]).toBe(secondArgument);
        });

    });

    describe('when given an array of deferred objects', function() {

        var spy, passedDeferred1, passedDeferred2;

        beforeEach(function() {
            spy = jasmine.createSpy('when([deferred, deferred]).then');
            passedDeferred1 = new Deferred();
            passedDeferred2 = new Deferred();

            when([passedDeferred1, passedDeferred2]).then(spy);
        });

        it('should resolve the returned deferred only when all passed deferred objects are resolved', function() {
            passedDeferred1.resolve();
            expect(spy.callCount).toBe(0);

            passedDeferred2.resolve();
            expect(spy.callCount).toBe(1);
        });

        it('should pass all arguments of all passed deferreds to the returned deferred success handler as arrays', function() {
            var firstArgument = {}, secondArgument = [];
            passedDeferred1.resolve(firstArgument);
            passedDeferred2.resolve(secondArgument);

            expect(spy.argsForCall[0][0][0]).toBe(firstArgument);
            expect(spy.argsForCall[0][1][0]).toBe(secondArgument);
        });

    });

    describe('when given multiple deferred objects as separate arguments', function() {

        var spy, passedDeferred1, passedDeferred2;

        beforeEach(function() {
            spy = jasmine.createSpy('when(deferred, deferred).then');
            passedDeferred1 = new Deferred();
            passedDeferred2 = new Deferred();

            when(passedDeferred1, passedDeferred2).then(spy);
        });

        it('should resolve the returned deferred only when all passed deferred objects are resolved', function() {
            passedDeferred1.resolve();
            expect(spy.callCount).toBe(0);

            passedDeferred2.resolve();
            expect(spy.callCount).toBe(1);
        });

        it('should pass all arguments of all passed deferreds to the returned deferred success handler as arrays', function() {
            var firstArgument = {}, secondArgument = [];
            passedDeferred1.resolve(firstArgument);
            passedDeferred2.resolve(secondArgument);

            expect(spy.argsForCall[0][0][0]).toBe(firstArgument);
            expect(spy.argsForCall[0][1][0]).toBe(secondArgument);
        });

    });

    describe('when given a simple value', function() {

        var spy, value = 1;

        beforeEach(function() {
            spy = jasmine.createSpy('when(value).then()');
            when(value).then(spy);
        });

        it('should resolve the returned deferred immediately', function() {
            expect(spy).toHaveBeenCalled();
        });

        it('should pass the value wrapped in an array to the returned deferred success handler', function() {
            expect(spy.argsForCall[0][0][0]).toBe(value);
        });

    });

    describe('when given an array of simple values', function() {

        var spy, value1 = 1, value2 = 2;

        beforeEach(function() {
            spy = jasmine.createSpy('when(value).then()');
            when([value1, value2]).then(spy);
        });

        it('should resolve the returned deferred immediately', function() {
            expect(spy).toHaveBeenCalled();
        });

        it('should pass the values wrapped in arrays to the returned deferred success handler', function() {
            expect(spy.argsForCall[0][0][0]).toBe(value1);
            expect(spy.argsForCall[0][1][0]).toBe(value2);
        });

    });

});