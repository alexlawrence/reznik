'use strict';

var horaa = require('horaa');
var fs = horaa('fs');

var testMethod = require('../../src/filesystem/readFiles.js');

describe('filesystem/readFiles', function() {

    it('should throw an error when passing an invalid base path', function() {

        fs.hijack('lstatSync', function() {
            return {
                isDirectory: function() { return false; }
            };
        });

        expect(function() {
            testMethod('../....../.....', []);
        }).toThrow();

        expect(function() {
            testMethod('cli.spec.js', []);
        }).toThrow();

        fs.restore('lstatSync');
    });

    it('should not throw an error when passing a valid base path', function() {

        fs.hijack('lstatSync', function() {
            return {
                isDirectory: function() { return true; }
            };
        });

        expect(function() {
            testMethod('testFiles', []);
        }).not.toThrow();

        fs.restore('lstatSync');
    });

    it('should return the correct file names when given multiple files', function() {

        fs.hijack('lstatSync', function() {
            return {
                isDirectory: function() { return true; }
            };
        });

        fs.hijack('readFileSync', function() {
            return 'content';
        })

        var files = testMethod('testFiles',
            ['1.js', '2.js', '3.js', 'subDirectory/1.js', 'subDirectory/2.js', 'subDirectory/3.js']);

        expect(files.length).toBe(6);
        expect(files[5].filename).toBe('subDirectory/3.js');

        fs.restore('readFileSync');
    });

});
