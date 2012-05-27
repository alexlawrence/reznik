'use strict';

var horaa = require('horaa');
var fs = horaa('fs');
var waitsForDeferred = require('../waitsForDeferred.js');

var occurrencesOf = require('../../src/common/occurrencesOf.js');

var testMethod = require('../../src/filesystem/getAllFilenames.js');

var hijackAsync = function(module, functionName, functionBody) {
    //noinspection JSValidateTypes
    module.hijack(functionName, function() {
        var scope = this, args = arguments;
        setTimeout(function() { functionBody.apply(scope, args) }, 0);
    });
};

describe('filesystem/getAllFilenames', function() {

    afterEach(function() {
        fs.restore('readdir');
        fs.restore('lstat');
    });

    describe('when given an empty directory', function() {

        it('should not freeze', function() {
            hijackAsync(fs, 'readdir', function(directory, callback) {
                callback(undefined, []);
            });
            hijackAsync(fs, 'lstat', function(path, callback) {
                callback(undefined, {
                    isDirectory: function() { return false; }
                });
            });

            waitsForDeferred(testMethod({ basePath: 'testFiles' })).then(function() {});
        });

    });

    describe('when given a flat directory', function() {

        it('should return a list of all filenames', function() {
            hijackAsync(fs, 'readdir', function(directory, callback) {
                callback(undefined, ['1.js', '2.js']);
            });
            hijackAsync(fs, 'lstat', function(path, callback) {
                callback(undefined, {
                    isDirectory: function() { return false; }
                });
            });

            waitsForDeferred(testMethod({ basePath: 'testFiles' })).then(function(files) {
                expect(occurrencesOf(files, '1.js')).toBe(1);
                expect(occurrencesOf(files, '2.js')).toBe(1);
            });
        });

    });

    describe('when given a directory with a subdirectory with files', function() {

        it('should return a list containing the filenames in the subdirectory', function() {
            var basePath = 'testFiles', subDirectory = 'subDirectory';

            hijackAsync(fs, 'readdir', function(directory, callback) {
                var result = directory == (basePath + '/' + subDirectory + '/') ?
                    ['1.js', '2.js'] : [subDirectory];
                callback(undefined, result)
            });
            hijackAsync(fs, 'lstat', function(path, callback) {
                callback(undefined, {
                    isDirectory: function() {
                        return path.indexOf(subDirectory) === (path.length - subDirectory.length);
                    }
                });
            });

            waitsForDeferred(testMethod({ basePath: basePath })).then(function(files) {
                expect(occurrencesOf(files, 'subDirectory/1.js')).toBe(1);
                expect(occurrencesOf(files, 'subDirectory/2.js')).toBe(1);
            });
        });

    });

    describe('when given an array of pattern strings to exclude', function() {

        it('should return a list of all filenames excluding the ones matching the patterns', function() {
            var subDirectory = 'subDirectory';

            hijackAsync(fs, 'readdir', function(directory, callback) {
                var result = directory.indexOf(subDirectory) >= 0 ?
                    ['1.js'] : ['2.js', '_cache.specs.js', subDirectory];
                callback(undefined, result);
            });
            hijackAsync(fs, 'lstat', function(path, callback) {
                callback(undefined, {
                    isDirectory: function() {
                        return path.indexOf(subDirectory) === path.length - subDirectory.length;
                    }
                });
            });

            waitsForDeferred(testMethod({
                basePath: __dirname + '/testFiles/getAllFiles',
                exclude: ['subDirectory', 'specs.js']
            })).then(function(files) {
                expect(occurrencesOf(files, '_cache.specs.js')).toBe(0);
                expect(occurrencesOf(files, 'subDirectory/2.js')).toBe(0);
            });
        });

    });

    describe('when given a file ending', function() {

        it('should return a list of all filenames matching the file ending', function() {
            hijackAsync(fs, 'readdir', function(directory, callback) {
                callback(undefined, ['1.js', '2.txt']);
            });
            hijackAsync(fs, 'lstat', function(path, callback) {
                callback(undefined, {
                    isDirectory: function() { return false; }
                });
            });

            waitsForDeferred(testMethod({
                basePath: 'testFiles',
                fileEnding: 'js'
            })).then(function(files) {
                expect(files.length).toBe(1);
            });
        });

    });

});