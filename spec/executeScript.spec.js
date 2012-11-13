'use strict';

var horaa = require('horaa');
var waitsForDeferred = require('./waitsForDeferred.js');
var testMethod = require('../src/executeScript.js');
var fs = horaa('fs');
var vm = horaa('vm');

describe('execution/executeInNode', function() {

    describe('when loading a file from the filesystem', function() {

        var passedArguments;
        var spy;

        beforeEach(function() {
            spy = jasmine.createSpy('readFile');
            //noinspection JSValidateTypes
            fs.hijack('readFile', function() {
                passedArguments = arguments;
                spy();
            });
            testMethod('basePath', 'filename', {});
        });

        afterEach(function() {
            fs.restore('readFile');
        });

        it('should call fs.readFile', function() {
            expect(spy).toHaveBeenCalled();
        });

        it('should combine the given base path and the given filename', function() {
            expect(passedArguments[0]).toBe('basePath/filename');
        });

        it('should pass utf-8 as expected encoding to the fs.readFile', function() {
            expect(passedArguments[1]).toBe('utf-8');
        });
    });

    describe('when executing loaded javascript content', function() {

        var passedArgumentsToRunInNewContext;
        var deferred;

        beforeEach(function() {
            //noinspection JSValidateTypes
            vm.hijack('runInNewContext', function() {
                passedArgumentsToRunInNewContext = arguments;
            });
        });

        afterEach(function() {
            vm.restore('runInNewContext');
            fs.restore('readFile');
        });

        it('should pass each javascript content to vm.runInNewContext', function () {
            var script = 'foobar';

            //noinspection JSValidateTypes
            fs.hijack('readFile', function (filename, encoding, callback) {
                callback(undefined, script);
            });

            deferred = testMethod('basePath', 'filename');

            waitsForDeferred(deferred).then(function() {
                expect(passedArgumentsToRunInNewContext[0]).toBe(script);
            });
        });

        it('should pass the given context object to vm.runInNewContext', function () {
            var context = {a: 1, b: 2, c: function() {}};

            //noinspection JSValidateTypes
            fs.hijack('readFile', function (filename, encoding, callback) {
                callback();
            });

            deferred = testMethod('basePath', 'filename', context);

            waitsForDeferred(deferred).then(function() {
                expect(passedArgumentsToRunInNewContext[1]).toBe(context);
            });
        });

        it('should not rethrow any javascript errors occurring in a loaded script', function () {
            var done = false;

            //noinspection JSValidateTypes
            fs.hijack('readFile', function (filename, encoding, callback) {
                callback(undefined, 'window.foobar.foobar = "foobar";');
            });

            deferred = testMethod('basePath', 'filename');
            waitsForDeferred(deferred).then(function() { });
        });

    });

});