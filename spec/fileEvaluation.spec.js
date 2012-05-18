'use strict';

var subject = require('../src/fileEvaluation.js');

var Deferred = require('../src/common/Deferred.js');

var horaa = require('horaa');
var waitsForDeferred = require('./waitsForDeferred.js');

var amdProxy = horaa(__dirname + '../../src/amdProxy.js');

describe('fileEvaluation', function() {

    var resolvedDeferred = function() {
        var deferred = new Deferred();
        deferred.resolve();
        return deferred;
    };

    var hijackExecutionWith = function(callback) {
        subject.setExecutionMethod(callback);
    };

    describe('evaluateFiles', function() {

        describe('when given no files', function() {

            it('should not throw an error', function() {
                expect(function() { subject.evaluateFiles('basePath'); }).not.toThrow();
            });

        });

        describe('when given javascript files', function() {

            describe('on executing scripts', function() {

                var passedArguments, executionSpy, deferred;

                beforeEach(function() {

                    executionSpy = jasmine.createSpy('execution');

                    hijackExecutionWith(function() {
                        passedArguments = arguments;
                        executionSpy();
                        return resolvedDeferred();
                    });

                    deferred = subject.evaluateFiles('basePath', ['path/to/script.js']);
                });

                it('should use the passed method to setExecutionMethod to execute scripts', function() {
                    waitsForDeferred(deferred).then(function() {
                        expect(executionSpy).toHaveBeenCalled();
                    });
                });

                it('should pass the basePath as first argument to the execution method', function() {
                    waitsForDeferred(deferred).then(function() {
                        expect(passedArguments[0]).toBe('basePath');
                    });
                });

                it('should pass each filename as second argument to the execution method', function() {
                    waitsForDeferred(deferred).then(function() {
                        expect(passedArguments[1]).toBe('path/to/script.js');
                    });
                });

                it('should pass a context object containing define and require to the execution method', function() {
                    waitsForDeferred(deferred).then(function() {
                        expect(typeof passedArguments[2].define).toBe('function');
                        expect(typeof passedArguments[2].require).toBe('function');
                    });
                });

            });

            describe('the return value', function() {

                it('should include all errors', function() {

                    var errors = [1, 2, 3];
                    //noinspection JSValidateTypes
                    amdProxy.hijack('getErrors', function() {
                        return errors;
                    });

                    waitsForDeferred(subject.evaluateFiles('basePath', [])).then(function(evaluationResult) {
                        expect(evaluationResult.errors).toBe(errors);
                        amdProxy.restore('getErrors');
                    });
                });

                it('should include all scripts', function() {

                    var scripts = [
                        {id: 'a', filename: 'a.js', dependencies: [], type: 'module'},
                        {id: 'b', filename: 'b.js', dependencies: ['a'], type: 'module'}
                    ];
                    //noinspection JSValidateTypes
                    amdProxy.hijack('getScripts', function() {
                        return scripts;
                    });

                    waitsForDeferred(subject.evaluateFiles('basePath', [])).then(function(evaluationResult) {
                        expect(evaluationResult.scripts).toBe(scripts);
                        amdProxy.restore('getScripts');
                    });
                });

                it('should include the configuration', function() {

                    var configuration = {a: 1, b: 2, c: 3, d: {e: 4}};
                    //noinspection JSValidateTypes
                    amdProxy.hijack('getConfiguration', function() {
                        return configuration;
                    });

                    waitsForDeferred(subject.evaluateFiles('basePath', [])).then(function(evaluationResult) {
                        expect(evaluationResult.configuration).toBe(configuration);
                        amdProxy.restore('getConfiguration');
                    });
                });

                it('should include all information', function() {

                    waitsForDeferred(subject.evaluateFiles('basePath', [])).then(function(evaluationResult) {
                        expect(evaluationResult.information).toBeDefined();
                    });
                });

            });

        });

    });

});