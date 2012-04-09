'use strict';

var horaa = require('horaa');
var fs = horaa('fs');

var occurrencesOf = require('../../src/common/occurrencesOf.js');
occurrencesOf.installAsPrototype();

var testMethod = require('../../src/filesystem/getAllFiles.js');

describe('filesystem/getAllFiles', function() {

    afterEach(function() {
        fs.restore('readdirSync');
        fs.restore('lstatSync');
    });

    it('should return a list of all files in the top level directory', function() {
        fs.hijack('readdirSync', function() {
            return ['1.js', '2.js', '3.js'];
        });
        fs.hijack('lstatSync', function() {
            return {
                isDirectory: function() { return false; }
            };
        });

        var files = testMethod({ basePath: 'testFiles' });
        expect(files[0]).toBe('1.js');
        expect(files[1]).toBe('2.js');
        expect(files[2]).toBe('3.js');
    });

    it('should return a list of all files including subdirectories', function() {
        var subDirectory = 'subDirectory';

        fs.hijack('readdirSync', function(directory) {
            return directory.indexOf(subDirectory) === -1 ? ['1.js', '2.js', '3.js', subDirectory] :
                ['1.js', '2.js', '3.js'];
        });
        fs.hijack('lstatSync', function(item) {
            return {
                isDirectory: function() {
                    return item.indexOf(subDirectory) === item.length - subDirectory.length;
                }
            };
        });

        var files = testMethod({ basePath: 'testFiles' });
        expect(files[3]).toBe('subDirectory/1.js');
        expect(files[4]).toBe('subDirectory/2.js');
        expect(files[5]).toBe('subDirectory/3.js');
    });

    it('should return a list of all files excluding any items matching strings to exclude', function() {
        var subDirectory = 'subDirectory';

        fs.hijack('readdirSync', function(directory) {
            return directory.indexOf(subDirectory) === -1 ?
                ['1.js', '2.js', '3.js', '_cache.specs.js', subDirectory] : ['1.js', '2.js', '3.js'];
        });
        fs.hijack('lstatSync', function(item) {
            return {
                isDirectory: function() {
                    return item.indexOf(subDirectory) === item.length - subDirectory.length;
                }
            };
        });

        var files = testMethod({
            basePath: __dirname + '/testFiles/getAllFiles',
            exclude: ['subDirectory', 'specs.js']
        });

        expect(files.occurrencesOf('_cache.specs.js')).toBe(0);
        expect(files.occurrencesOf('subDirectory/1.js')).toBe(0);
    });

    it('should return a list of all files matching the file ending', function() {
        fs.hijack('readdirSync', function() {
            return ['1.js', '2.js', '3.js'];
        });
        fs.hijack('lstatSync', function() {
            return {
                isDirectory: function() { return false; }
            };
        });

        var files = testMethod({
            basePath: 'testFiles',
            fileEnding: 'js'
        });
        expect(files.length).toBe(3);

        var files = testMethod({
            basePath: 'testFiles',
            fileEnding: 'foobar'
        });
        expect(files.length).toBe(0);
    });

});