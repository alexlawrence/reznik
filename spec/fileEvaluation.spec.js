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

            describe('on executing scripts', function() {

                var passedArguments;
                var executionSpy;

                beforeEach(function() {

                    executionSpy = jasmine.createSpy('execution');

                    hijackExecutionWith(function() {
                        passedArguments = arguments;
                        executionSpy();
                    });

                    subject.evaluateFiles('basePath', ['path/to/script.js']);

                });

                it('should use the passed method to setExecutionMethod to execute scripts', function() {
                    expect(executionSpy).toHaveBeenCalled();
                });

                it('should pass the basePath as first argument to the execution method', function() {
                    expect(passedArguments[0]).toBe('basePath');
                });

                it('should pass each filename as second argument to the execution method', function() {
                    expect(passedArguments[1]).toBe('path/to/script.js');
                });

                it('should pass a context object containing define and require to the execution method', function() {
                    expect(typeof passedArguments[2].define).toBe('function');
                    expect(typeof passedArguments[2].require).toBe('function');
                });

            });

            describe('the return value', function() {

                it('should include all errors', function() {

                    var errors = [1, 2, 3];
                    amdProxy.hijack('getErrors', function() {
                        return errors;
                    });

                    var evaluationResult = subject.evaluateFiles([]);

                    expect(evaluationResult.errors).toBe(errors);

                    amdProxy.restore('getErrors');
                });

                it('should include all modules', function() {

                    var modules = {'a': {filename: 'a.js', dependencies: []}, 'b': {filename: 'b.js', dependencies: ['a']}};
                    amdProxy.hijack('getModules', function() {
                        return modules;
                    });

                    var evaluationResult = subject.evaluateFiles([]);

                    expect(evaluationResult.modules).toBe(modules);

                    amdProxy.restore('getModules');
                });

                it('should include the configuration', function() {

                    var configuration = {a: 1, b: 2, c: 3, d: {e: 4}};
                    amdProxy.hijack('getConfiguration', function() {
                        return configuration;
                    });

                    var evaluationResult = subject.evaluateFiles([]);

                    expect(evaluationResult.configuration).toBe(configuration);

                    amdProxy.restore('getConfiguration');
                });

                it('should include all information', function() {

                    var evaluationResult = subject.evaluateFiles([]);

                    expect(evaluationResult.information).toBeDefined();

                });

            });

        });

    });

});