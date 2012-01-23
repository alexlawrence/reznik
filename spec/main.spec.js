'use strict';

var subject = require('../src/main.js');

var horaa = require('horaa');

var amdProxy = horaa(__dirname + '/../src/execution/amdProxy.js');
var filesystem = horaa(__dirname + '/../src/common/filesystem.js');
var transformation = horaa(__dirname + '/../src/processing/transformation.js');
var jsonReporter = horaa(__dirname + '/../src/reporting/jsonReporter.js');
var htmlReporter = horaa(__dirname + '/../src/reporting/htmlReporter.js');
var verification = horaa(__dirname + '/../src/processing/verification.js');

var executeOrIgnore = function(callback) {
    try{
        callback();
    }
    catch(error) {
        // ignore
    }
}

describe('main', function() {

    describe('run', function() {

        beforeEach(function() {
            filesystem.hijack('getAllFiles', function() {
                return [];
            });

            filesystem.hijack('readFiles', function(basePath, filepaths) {
               return [];
            });
        });

        afterEach(function() {
            filesystem.restore('getAllFiles');
            filesystem.restore('readFiles');
        });

        describe('filesystem', function() {

            it('should call filesystem.getAllFiles with given basePath, directoriesToExclude and fileEnding if given', function() {

                var basePath = 'testPath';
                var exclude = ['foo', 'bar'];
                var fileEnding = 'js';
                var passedBasePath, passedExclude, passedFileEnding;

                filesystem.restore('getAllFiles');
                filesystem.hijack('getAllFiles', function(options) {
                    passedBasePath = options.basePath;
                    passedExclude = options.exclude;
                    passedFileEnding = options.fileEnding;
                });

                executeOrIgnore(function() {
                    subject.run(basePath, {
                        exclude: exclude, fileEnding: fileEnding
                    });
                });

                expect(passedBasePath).toBe(basePath);
                expect(passedExclude).toBe(exclude);
                expect(passedFileEnding).toBe(fileEnding);
            });

            it('should call filesystem.readFiles with given basePath and result from getAllFiles', function() {

                var passedFilenames;

                filesystem.restore('getAllFiles');
                filesystem.hijack('getAllFiles', function() {
                    return ['1.js', '2.js', '3.js'];
                });
                filesystem.restore('readFiles');
                filesystem.hijack('readFiles', function(basePath, filenames) {
                    passedFilenames = filenames;
                });

                executeOrIgnore(function() {
                    subject.run(basePath);
                });

                 var basePath = 'testPath';

                executeOrIgnore(subject.run);

                expect(passedFilenames.length).toBe(3);

            });

        });

        describe('evaluation', function() {

            it('should set the amdProxy execution method', function() {

                var spy = jasmine.createSpy();

                amdProxy.hijack('setExecutionMethod', spy);

                executeOrIgnore(subject.run);

                expect(spy).toHaveBeenCalled();

                amdProxy.restore('setExecutionMethod');

            });

            it('should call the amdProxy with the result from filesystem', function() {

                var passedFiles;

                filesystem.restore('readFiles');
                filesystem.hijack('readFiles', function(basePath, filenames) {
                   return [
                       {filename: '1.js', contents: '1'},
                       {filename: '2.js', contents: '1'},
                       {filename: '3.js', contents: '3'}
                   ];
                });
                amdProxy.hijack('evaluateFiles', function(files) {
                    passedFiles = files;
                });

                executeOrIgnore(subject.run);

                expect(passedFiles.length).toBe(3);
                expect(passedFiles[0].filename).toBe('1.js');

                amdProxy.restore('evaluateFiles');

            });

        });

        describe('options', function() {

            beforeEach(function() {
                amdProxy.hijack('evaluateFiles', function() {
                    return {
                        modules: {
                            '1': {dependencies: ['2', '3']},
                            '2': {dependencies: ['3']},
                            '3': {dependencies: []}
                        }
                    };
                });
            });

            afterEach(function() {
                amdProxy.restore('evaluateFiles');
            });

            it('should call the verification with the result from amdProxy when option verify is set to true', function() {

                var passedEvaluationResult;

                verification.hijack('executeAllAvailableChecks', function(evaluationResult) {
                    passedEvaluationResult = evaluationResult;
                });

                executeOrIgnore(function() {
                    subject.run('foobar', { verify: true });
                });

                expect(passedEvaluationResult.modules).toBeDefined();
                expect(passedEvaluationResult.modules['1'].dependencies[0]).toBe('2');

                verification.restore('executeAllAvailableChecks');

            });

            it('should not call the verification when option verify is set to false', function() {

                var spy = jasmine.createSpy();

                verification.hijack('executeAllAvailableChecks', spy);

                executeOrIgnore(function() {
                    subject.run('foobar', { verify: false });
                });

                expect(spy).not.toHaveBeenCalled();

                verification.restore('executeAllAvailableChecks');

            });

            it('should call the flattening with the result from amdProxy when option flattened is set to true', function() {

                var passedModules;

                transformation.hijack('generateFlattenedModuleList', function(modules) {
                    passedModules = modules;
                });

                executeOrIgnore(function() {
                    subject.run('foobar', { flattened: true });
                });

                expect(passedModules).toBeDefined();
                expect(passedModules['1'].dependencies[0]).toBe('2');

                transformation.restore('generateFlattenedModuleList');

            });

            it('should not call the flattening when option flattened is set to false', function() {

                var spy = jasmine.createSpy();

                transformation.hijack('generateFlattenedModuleList', spy);

                executeOrIgnore(function() {
                    subject.run('foobar', { flattened: false });
                });

                expect(spy).not.toHaveBeenCalled();

                transformation.restore('generateFlattenedModuleList');

            });

            it('should call the inverting with the result from amdProxy when option inverted is set to true', function() {

                var passedModules;

                transformation.hijack('generateInvertedModuleList', function(modules) {
                    passedModules = modules;
                });

                executeOrIgnore(function() {
                    subject.run('foobar', { inverted: true });
                });

                transformation.restore('generateInvertedModuleList');

                expect(passedModules).toBeDefined();
                expect(passedModules['1'].dependencies[0]).toBe('2');
            });

            it('should not call the inverting when option inverted is set to false', function() {

                var spy = jasmine.createSpy();

                transformation.hijack('generateInvertedModuleList', spy);

                executeOrIgnore(function() {
                    subject.run('foobar', { flattened: false });
                });

                expect(spy).not.toHaveBeenCalled();

                transformation.restore('generateInvertedModuleList');

            });

        });

        describe('reporting', function() {

            it('should call the jsonReporter if output option not given', function() {

                var spy = jasmine.createSpy();

                jsonReporter.hijack('render', spy);

                subject.run('foobar');

                expect(spy).toHaveBeenCalled();

                jsonReporter.restore('render');

            });

            it('should call the htmlReporter if output option is set to "html"', function() {

                var spy = jasmine.createSpy();

                htmlReporter.hijack('render', spy);

                subject.run('foobar', {output: 'html'});

                expect(spy).toHaveBeenCalled();

                htmlReporter.restore('render');

            });

            it('should not throw an error if output option is set to an invalid reporter', function() {

                expect(function() {
                    subject.run('foobar', {output: 'foobar'});
                }).not.toThrow();

            });

        });

    });

});