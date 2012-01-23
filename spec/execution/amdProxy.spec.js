'use strict';

var subject = require('../../src/execution/amdProxy.js');

describe('amdProxy', function() {

    var hijackExecutionWith = function(callback) {
        subject.setExecutionMethod(callback);
    };

    describe('setExecutionEngine', function() {

        it('should use the passed object´s execute method to execute scripts when calling evaluateFiles', function() {

            var spy = jasmine.createSpy();

            subject.setExecutionMethod(spy);
            subject.evaluateFiles([{filename: 'foobar.js', contents: 'irrelevant'}]);

            expect(spy).toHaveBeenCalled();

        });

    });

    describe('evaluateFiles', function() {

        describe('when given no files', function() {

            it('should not throw an error when passing undefined', function() {
                expect(subject.evaluateFiles).not.toThrow();
            });

            it('should return an object containing an empty array of errors', function() {
                var result = subject.evaluateFiles();
                expect(Array.isArray(result.errors)).toBeTruthy();
            });

            it('should return an object containing a empty hash array of modules', function() {
                var result = subject.evaluateFiles();
                expect(typeof result.modules).toBe('object');
            });


        });

        describe('when given any javascript files', function() {

            it('should pass the file contents as script to the execution engine', function() {

                var passedScript = '';

                hijackExecutionWith(function(script, context) {
                    passedScript = script;
                });

                var files = [];
                files.push({
                    filename: 'one.js',
                    contents: 'file content of one.js'
                });

                subject.evaluateFiles(files);

                expect(passedScript).toBe('file content of one.js');

            });

            it('should pass a context object containing a define and require method', function() {

                var typeOfDefine, typeOfRequire;

                hijackExecutionWith(function(script, context) {
                    typeOfDefine = typeof context.define;
                    typeOfRequire = typeof context.require;
                });

                var files = [];
                files.push({
                    filename: 'one.js',
                    contents: 'file content of one.js'
                });

                subject.evaluateFiles(files);

                expect(typeOfDefine).toBe('function');
                expect(typeOfRequire).toBe('function');

            });

        });

        describe('when given amd modules using define', function() {

            it('should include a module with its dependencies in the result', function() {

                hijackExecutionWith(function(script, context) {
                    context.define("one", ["two", "three", "four/four/four"], function() {});
                });

                var files = [];
                files.push({
                    filename: 'one.js',
                    contents: 'is hijacked anyways'
                });

                var result = subject.evaluateFiles(files);

                expect(result.modules.one).toBeDefined();
                expect(result.modules.one.dependencies.length).toBe(3);
                expect(result.modules.one.dependencies[0]).toBe('two');
                expect(result.modules.one.dependencies[1]).toBe('three');
                expect(result.modules.one.dependencies[2]).toBe('four/four/four');
            });

            it('should include a module in the result even if it has no dependencies', function() {

                hijackExecutionWith(function(script, context) {
                    context.define("one", function() {});
                });

                var files = [];
                files.push({
                    filename: 'one.js',
                    contents: 'is hijacked anyways'
                });

                var result = subject.evaluateFiles(files);

                expect(result.modules.one).toBeDefined();
            });

            it('should not convert the id to lowercase', function() {

                hijackExecutionWith(function(script, context) {
                    context.define("hereAreSomeCases", function() {});
                });

                var files = [];
                files.push({
                    filename: 'hereAreSomeCases.js',
                    contents: 'is hijacked anyways'
                });

                var result = subject.evaluateFiles(files);

                expect(result.modules.hereAreSomeCases).toBeDefined();
                expect(result.modules.herearesomecases).toBeUndefined();
            });

            it('should include a module´s filename in the result', function() {

                hijackExecutionWith(function(script, context) {
                    context.define("one", ["two"], function() {});
                });

                var files = [];
                files.push({
                    filename: 'one.js',
                    contents: 'is hijacked anyways'
                });

                var result = subject.evaluateFiles(files);

                expect(result.modules.one.filename).toBe('one.js');
            });

            it('should not convert the dependencies of a module to lowercase ids', function() {

                hijackExecutionWith(function(script, context) {
                    context.define("one", ["caseTwo", "caseThree", "four/four/caseFour"], function() {});
                });

                var files = [];
                files.push({
                    filename: 'one.js',
                    contents: 'is hijacked anyways'
                });

                var result = subject.evaluateFiles(files);

                expect(result.modules.one).toBeDefined();
                expect(result.modules.one.dependencies.length).toBe(3);
                expect(result.modules.one.dependencies[0]).toBe('caseTwo');
                expect(result.modules.one.dependencies[1]).toBe('caseThree');
                expect(result.modules.one.dependencies[2]).toBe('four/four/caseFour');
            });

            it('should determine the id for an anonymous module by its filename', function() {

                hijackExecutionWith(function(script, context) {
                    context.define(["two", "three"], function() {});
                });

                var files = [];
                files.push({
                    filename: 'one.js',
                    contents: 'is hijacked anyways'
                });

                var result = subject.evaluateFiles(files);

                expect(result.modules.one).toBeDefined();

            });

            it('should not convert the implicit id of an anonymous module to lowercase', function() {

                hijackExecutionWith(function(script, context) {
                    context.define(function() {});
                });

                var files = [];
                files.push({
                    filename: 'hereAreSomeCases.js',
                    contents: 'is hijacked anyways'
                });

                var result = subject.evaluateFiles(files);

                expect(result.modules.hereAreSomeCases).toBeDefined();
                expect(result.modules.herearesomecases).toBeUndefined();
            });

            it('should include the dependencies of an anonymous module in the result', function() {

                hijackExecutionWith(function(script, context) {
                    context.define(['two', 'three'], function() {});
                });

                var files = [];
                files.push({
                    filename: 'one.js',
                    contents: 'is hijacked anyways'
                });

                var result = subject.evaluateFiles(files);

                expect(result.modules.one.dependencies.length).toBe(2);
            });

            it('should set the anonymous flag to true for an anonymous module', function() {

                hijackExecutionWith(function(script, context) {
                    context.define(['two', 'three'], function() {});
                });

                var files = [];
                files.push({
                    filename: 'one.js',
                    contents: 'is hijacked anyways'
                });

                var result = subject.evaluateFiles(files);

                expect(result.modules.one.anonymous).toBeTruthy();
            });

            it('should not execute the factory of a module', function() {

                hijackExecutionWith(function(script, context) {
                    context.define('one', ['two', 'three'], function() {
                        context.require(['four'], function() {});
                    });
                });

                var files = [];
                files.push({
                    filename: 'one.js',
                    contents: 'is hijacked anyways'
                });

                var evaluationResult = subject.evaluateFiles(files);

                expect(evaluationResult.modules.one.dependencies.length).toBe(2);
            });

            it('should not execute the factory of a module when it has no dependencies', function() {

                hijackExecutionWith(function(script, context) {
                    context.define('one', function() {
                        context.require(['two'], function() {});
                    });
                });

                var files = [];
                files.push({
                    filename: 'one.js',
                    contents: 'is hijacked anyways'
                });

                var evaluationResult = subject.evaluateFiles(files);

                expect(evaluationResult.modules.one.dependencies.length).toBe(0);
            });

            it('should not return an error when an id matches the filename', function() {

                hijackExecutionWith(function(script, context) {
                    context.define('path/to/one/module', function() {});
                });

                var files = [];
                files.push({
                    filename: 'path/to/one/module.js',
                    contents: 'is hijacked anyways'
                });

                var result = subject.evaluateFiles(files);

                expect(result.errors.length).toBe(0);
            });

            it('should return an error when an id does not match the filename', function() {

                hijackExecutionWith(function(script, context) {
                    context.define('wrong/path/to/one/module', function() {});
                });

                var files = [];
                files.push({
                    filename: 'path/to/one/module.js',
                    contents: 'is hijacked anyways'
                });

                var result = subject.evaluateFiles(files);

                expect(result.errors.length).toBe(1);
                expect(result.errors[0]).toBe('mismatching id and filename in path/to/one/module.js');
            });

            it('should correct the filename and not throw an error when using windows path (\\)', function() {

                hijackExecutionWith(function() {});

                var files = [];
                files.push({
                    filename: 'path\\to\\one\\module.js',
                    contents: 'define("path/to/one/module", function() {});'
                });

                var result = subject.evaluateFiles(files);

                expect(result.errors.length).toBe(0);
            });

            it('should return an error when a module contains multiple identical defines', function() {

                hijackExecutionWith(function(script, context) {
                    context.define('path/to/one/module', function() {});
                    context.define('path/to/one/module', function() {});
                });

                var files = [];
                files.push({
                    filename: 'path/to/one/module.js',
                    contents: 'is hijacked anyways'
                });

                var result = subject.evaluateFiles(files);

                expect(result.errors.length).toBe(1);
                expect(result.errors[0]).toBe('duplicate module definition in path/to/one/module.js');
            });

        });

        describe('when given javascript files using require', function() {

            it('should generate an implicit id from filename', function() {

                hijackExecutionWith(function(script, context) {
                    context.require(['two', 'three'], function() {});
                });

                var files = [];
                files.push({
                    filename: 'path/to/module/one.js',
                    contents: 'is hijacked anyways'
                });

                var result = subject.evaluateFiles(files);
                expect(result.modules['path/to/module/one']).toBeDefined();
            });

            it('should not convert implicit id to lowercase', function() {

                hijackExecutionWith(function(script, context) {
                    context.require(['two', 'three'], function() {});
                });

                var files = [];
                files.push({
                    filename: 'path/to/module/someCase.js',
                    contents: 'is hijacked anyways'
                });

                var result = subject.evaluateFiles(files);
                expect(result.modules['path/to/module/someCase']).toBeDefined();
                expect(result.modules['path/to/module/somecase']).toBeUndefined();
            });

            it('should include all dependencies for the implicit id', function() {

                hijackExecutionWith(function(script, context) {
                    context.require(['two', 'three'], function() {});
                });

                var files = [];
                files.push({
                    filename: 'path/to/module/one.js',
                    contents: 'is hijacked anyways'
                });

                var result = subject.evaluateFiles(files);

                expect(result.modules['path/to/module/one'].dependencies[0]).toBe('two');
                expect(result.modules['path/to/module/one'].dependencies[1]).toBe('three');
            });

            it('should not convert dependencies to lowercase ids', function() {

                hijackExecutionWith(function(script, context) {
                    context.require(['caseTwo', 'caseThree'], function() {});
                });

                var files = [];
                files.push({
                    filename: 'path/to/module/one.js',
                    contents: 'is hijacked anyways'
                });

                var result = subject.evaluateFiles(files);

                expect(result.modules['path/to/module/one'].dependencies[0]).toBe('caseTwo');
                expect(result.modules['path/to/module/one'].dependencies[1]).toBe('caseThree');
            });

            it('should not execute the factory', function() {

                hijackExecutionWith(function(script, context) {
                    context.require(['two', 'three'], function() {
                        context.require(['four'], function(){});
                    });
                });

                var files = [];
                files.push({
                    filename: 'path/to/module/one.js',
                    contents: 'is hijacked anyways'
                });

                var evaluationResult = subject.evaluateFiles(files);

                expect(evaluationResult.modules['path/to/module/one'].dependencies.length).toBe(2);
            });

            it('should not evaluate CommonJS require calls', function() {

                hijackExecutionWith(function(script, context) {
                    context.require('cjs');
                });

                var files = [];
                files.push({
                    filename: 'path/to/module/one.js',
                    contents: 'is hijacked anyways'
                });

                var result = subject.evaluateFiles(files);
                expect(result.modules['path/to/module/one']).toBeUndefined();

            });

        });

    });

});