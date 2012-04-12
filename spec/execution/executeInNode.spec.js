'use strict';

var horaa = require('horaa');
var testMethod = require('../../src/execution/executeInNode.js');
var fs = horaa('fs');
var vm = horaa('vm');

describe('execution/executeInNode', function() {

    describe('when loading a file from the filesystem', function() {

        var passedArguments;
        var spy;

        beforeEach(function() {
            spy = jasmine.createSpy('readFileSync');
            fs.hijack('readFileSync', function() {
                passedArguments = arguments;
                spy();
            });
            testMethod('basePath', 'filename', {});
        });

        afterEach(function() {
            fs.restore('readFileSync');
        });

        it('should call fs.readFileSync', function() {
            expect(spy).toHaveBeenCalled();
        });

        it('should combine the given base path and the given filename', function() {
            expect(passedArguments[0]).toBe('basePath/filename');
        });

        it('should pass utf-8 as expected encoding to the fs.readFileSync', function() {
            expect(passedArguments[1]).toBe('utf-8');
        });
    });

    describe('when executing loaded javascript content', function() {

        var passedArgumentsToRunInNewContext;

        beforeEach(function() {
            vm.hijack('runInNewContext', function() {
                passedArgumentsToRunInNewContext = arguments;
            });
        });

        afterEach(function() {
            vm.restore('runInNewContext');
            fs.restore('readFileSync');
        });

        it('should pass each javascript content to vm.runInNewContext', function () {
            var script = 'foobar';
            fs.hijack('readFileSync', function() {
                return script;
            });

            testMethod('basePath', 'filename');

            expect(passedArgumentsToRunInNewContext[0]).toBe(script);
        });

        it('should pass the given context object to vm.runInNewContext', function () {
            var context = {a: 1, b: 2, c: function() {}};
            fs.hijack('readFileSync', function() {
                return '';
            });

            testMethod('basePath', 'filename', context);

            expect(passedArgumentsToRunInNewContext[1]).toBe(context);
        });

        it('should not rethrow any javascript errors occurring in a loaded script', function () {
            var script = 'foobar';
            fs.hijack('readFileSync', function() {
                return 'window.foobar.foobar = "foobar";';
            });

            expect(function() { testMethod('basePath', 'filename'); }).not.toThrow();
        });

    });

});