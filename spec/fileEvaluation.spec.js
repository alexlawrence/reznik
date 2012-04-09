'use strict';

var subject = require('../src/fileEvaluation.js');

var horaa = require('horaa');

var amdProxy = horaa(__dirname + '../../src/amdProxy.js');

describe('fileEvaluation', function() {

    var hijackExecutionWith = function(callback) {
        subject.setExecutionMethod(callback);
    };

    describe('evaluateFiles', function() {

        describe('when given no files', function() {

            it('should not throw an error', function() {
                expect(subject.evaluateFiles).not.toThrow();
            });

        });

        describe('when given javascript files', function() {

            it('should use the passed method to setExecutionMethod to execute scripts', function() {

                var spy = jasmine.createSpy();

                subject.setExecutionMethod(spy);
                subject.evaluateFiles([{filename: 'foobar.js', contents: 'irrelevant'}]);

                expect(spy).toHaveBeenCalled();

            });

            it('should pass each file content as text to the execution method', function() {

                var passedScript = '';

                hijackExecutionWith(function(script, context) {
                    passedScript = script;
                });

                var files = [{filename: 'one.js', contents: 'file content of one.js'}];

                subject.evaluateFiles(files);

                expect(passedScript).toBe('file content of one.js');

            });

            it('should pass a context object containing define and require to the execution method', function() {

                var typeOfDefine = '', typeOfRequire = '';

                hijackExecutionWith(function(script, context) {
                    typeOfDefine = typeof context.define;
                    typeOfRequire = typeof context.require;
                });

                var files = [{filename: 'one.js'}];

                subject.evaluateFiles(files);

                expect(typeOfDefine).toBe('function');
                expect(typeOfRequire).toBe('function');

            });

            it('should include all errors in the return value', function() {

                var errors = [1, 2, 3];
                amdProxy.hijack('getErrors', function() {
                    return errors;
                });

                var evaluationResult = subject.evaluateFiles([]);

                expect(evaluationResult.errors).toBe(errors);

                amdProxy.restore('getErrors');
            });

            it('should include all modules in the return value', function() {

                var modules = {'a': {filename: 'a.js', dependencies: []}, 'b': {filename: 'b.js', dependencies: ['a']}};
                amdProxy.hijack('getModules', function() {
                    return modules;
                });

                var evaluationResult = subject.evaluateFiles([]);

                expect(evaluationResult.modules).toBe(modules);

                amdProxy.restore('getModules');
            });

            it('should include the configuration in the return value', function() {

                var configuration = {a: 1, b: 2, c: 3, d: {e: 4}};
                amdProxy.hijack('getConfiguration', function() {
                    return configuration;
                });

                var evaluationResult = subject.evaluateFiles([]);

                expect(evaluationResult.configuration).toBe(configuration);

                amdProxy.restore('getConfiguration');
            });

            it('should include all information in the return value', function() {

                var evaluationResult = subject.evaluateFiles([]);

                expect(evaluationResult.information).toBeDefined();

            });

        });

    });

});