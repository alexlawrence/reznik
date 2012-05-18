'use strict';

var horaa = require('horaa');
var fs = horaa('fs');
var waitsForDeferred = require('../waitsForDeferred.js');

var occurrencesOf = require('../../src/common/occurrencesOf.js');

var testMethod = require('../../src/filesystem/getAllFilenames.js');

describe('filesystem/getAllFilenames', function() {

    afterEach(function() {
        fs.restore('readdir');
        fs.restore('lstat');
    });

    it('should not freeze if a directory does not contain any files', function() {
        //noinspection JSValidateTypes
        fs.hijack('readdir', function(directory, callback) {
            setTimeout(function() {
                callback(undefined, []);
            }, 0);
        });
        //noinspection JSValidateTypes
        fs.hijack('lstat', function(path, callback) {
            setTimeout(function() {
                callback(undefined, {
                    isDirectory: function() { return false; }
                });
            }, 0);
        });

        waitsForDeferred(testMethod({ basePath: 'testFiles' })).then(function() {});
    });

    it('should return a list of all filenames in the top level directory', function() {
        //noinspection JSValidateTypes
        fs.hijack('readdir', function(directory, callback) {
            setTimeout(function() {
                callback(undefined, ['1.js', '2.js', '3.js']);
            }, 0);
        });
        //noinspection JSValidateTypes
        fs.hijack('lstat', function(path, callback) {
            setTimeout(function() {
                callback(undefined, {
                    isDirectory: function() { return false; }
                });
            }, 0);
        });

        waitsForDeferred(testMethod({ basePath: 'testFiles' })).then(function(files) {
            expect(occurrencesOf(files, '1.js')).toBe(1);
            expect(occurrencesOf(files, '2.js')).toBe(1);
            expect(occurrencesOf(files, '3.js')).toBe(1);
        });
    });

    it('should return a list of all filenames including subdirectories', function() {
        var subDirectory = 'subDirectory';

        //noinspection JSValidateTypes
        fs.hijack('readdir', function(directory, callback) {
            var result = directory.indexOf(subDirectory) === -1 ? ['1.js', '2.js', '3.js', subDirectory] :
                ['1.js', '2.js', '3.js'];
            callback(undefined, result);
        });
        //noinspection JSValidateTypes
        fs.hijack('lstat', function(path, callback) {
            callback(undefined, {
                isDirectory: function() {
                    return path.indexOf(subDirectory) === path.length - subDirectory.length;
                }
            });
        });

        waitsForDeferred(testMethod({ basePath: 'testFiles' })).then(function(files) {
            expect(occurrencesOf(files, 'subDirectory/1.js')).toBe(1);
            expect(occurrencesOf(files, 'subDirectory/2.js')).toBe(1);
            expect(occurrencesOf(files, 'subDirectory/3.js')).toBe(1);
        });
    });

    it('should return a list of all filenames excluding any items matching strings to exclude', function() {
        var subDirectory = 'subDirectory';

        //noinspection JSValidateTypes
        fs.hijack('readdir', function(directory, callback) {
            var result = directory.indexOf(subDirectory) >= 0 ?
                ['1.js', '2.js', '3.js'] : ['1.js', '2.js', '3.js', '_cache.specs.js', subDirectory];
            callback(undefined, result);
        });
        //noinspection JSValidateTypes
        fs.hijack('lstat', function(path, callback) {
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
            expect(occurrencesOf(files, 'subDirectory/1.js')).toBe(0);
        });
    });

    it('should return a list of all filenames matching the file ending', function() {
        //noinspection JSValidateTypes
        fs.hijack('readdir', function(directory, callback) {
            callback(undefined, ['1.js', '2.js', '3.js']);
        });
        //noinspection JSValidateTypes
        fs.hijack('lstat', function(path, callback) {
            callback(undefined, {
                isDirectory: function() { return false; }
            });
        });

        waitsForDeferred(testMethod({
            basePath: 'testFiles',
            fileEnding: 'js'
        })).then(function(files) {
            expect(files.length).toBe(3);
        });

        waitsForDeferred(testMethod({
            basePath: 'testFiles',
            fileEnding: 'foobar'
        })).then(function(files) {
            expect(files.length).toBe(0);
        });
    });

});