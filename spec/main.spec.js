var subject = require('../src/main.js')

var horaa = require('horaa');

var amdProxy = horaa(__dirname + '/../src/processing/amdProxy.js');
var filesystem = horaa(__dirname + '/../src/common/filesystem.js');
var transformation = horaa(__dirname + '/../src/processing/transformation.js');
var reporter = horaa(__dirname + '/../src/processing/reporter.js');
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

                filesystem.restore('getAllFiles');
                filesystem.hijack('getAllFiles', function(options) {
                    expect(options.basePath).toBe(basePath);
                    expect(options.exclude).toBe(directoriesToExclude);
                    expect(options.fileEnding).toBe(fileEnding);
                });

                executeOrIgnore(function() {
                    subject.run(basePath, {
                        exclude: exclude, fileEnding: fileEnding
                    });
                });
            });

            it('should call filesystem.readFiles with given basePath and result from getAllFiles', function() {

                filesystem.restore('getAllFiles');
                filesystem.hijack('getAllFiles', function() {
                    return ['1.js', '2.js', '3.js'];
                });
                filesystem.restore('readFiles');
                filesystem.hijack('readFiles', function(basePath, filepaths) {
                    expect(filepaths.length).toBe(3);
                });

                executeOrIgnore(function() {
                    subject.run(basePath);
                });

                 var basePath = 'testPath';

                executeOrIgnore(subject.run);

            });

        });

        describe('evaluation', function() {

            it('should call the amdProxy with the result from filesystem', function() {

                filesystem.restore('readFiles');
                filesystem.hijack('readFiles', function(basePath, filepaths) {
                   return [
                       {relativeFilename: '1.js', contents: '1'},
                       {relativeFilename: '2.js', contents: '1'},
                       {relativeFilename: '3.js', contents: '3'}
                   ];
                });
                amdProxy.hijack('evaluateFiles', function(files) {
                    expect(files.length).toBe(3);
                    expect(files[0].relativeFilename).toBe('1.js');
                });
                amdProxy.restore('evaluateFiles');

                executeOrIgnore(subject.run);

            });

        });

        describe('options', function() {

            beforeEach(function() {
                amdProxy.hijack('evaluateFiles', function() {
                    return {
                        modules: {
                            '1': ['2', '3'],
                            '2': ['3'],
                            '3': []
                        }
                    };
                });
            });

            afterEach(function() {
                amdProxy.restore('evaluateFiles');
            });

            it('should call the verification with the result from amdProxy when option verify is set to true', function() {

                verification.hijack('executeAllAvailableChecks', function(evaluationResult) {
                    expect(evaluationResult.modules).toBeDefined();
                    expect(evaluationResult.modules['1'][0]).toBe('2');
                });

                executeOrIgnore(function() {
                    subject.run('foobar', { verify: true });
                });

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

                transformation.hijack('generateFlattenedModuleList', function(modules) {
                    expect(modules).toBeDefined();
                    expect(modules['1'][0]).toBe('2');
                });

                executeOrIgnore(function() {
                    subject.run('foobar', { flattened: true });
                });

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

                transformation.hijack('generateInvertedModuleList', function(modules) {
                    expect(modules).toBeDefined();
                    expect(modules['1'][0]).toBe('2');
                });

                executeOrIgnore(function() {
                    subject.run('foobar', { flattened: true });
                });

                transformation.restore('generateInvertedModuleList');

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

        describe('reporter', function() {

            it('should call the reporter with json as type if output option not given', function() {

                reporter.hijack('to', function(type) {

                    expect(type).toBe('json');

                });

                subject.run('foobar');

                reporter.restore('to');

            });

            it('should call the reporter with output option as type if given', function() {

                reporter.hijack('to', function(type) {

                    expect(type).toBe('custom');

                });

                subject.run('foobar', { output: 'custom' });

                reporter.restore('to');

            });

        });

    });

});