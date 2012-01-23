'use strict';

require('../../src/common/arrayOccurrencesOf.js');
var subject = require('../../src/common/filesystem.js');
var horaa = require('horaa');
var fs = horaa('fs');

describe('filesystem', function() {

    describe('readFiles', function() {

        it('should throw an error when passing an invalid base path', function() {

            fs.hijack('lstatSync', function() {
                return {
                    isDirectory: function() { return false; }
                };
            });

            expect(function() {
                subject.readFiles('../....../.....', []);
            }).toThrow();

            expect(function() {
                subject.readFiles('cli.spec.js', []);
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
                subject.readFiles('testFiles', []);
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

            var files = subject.readFiles('testFiles',
                ['1.js', '2.js', '3.js', 'subDirectory/1.js', 'subDirectory/2.js', 'subDirectory/3.js']);

            expect(files.length).toBe(6);
            expect(files[5].filename).toBe('subDirectory/3.js');

            fs.restore('readFileSync');
        });

    });

    describe('getAllFiles', function() {

        afterEach(function() {
            fs.restore('readdirSync');
            fs.restore('lstatSync');
        });

        it('should return a list containing all files in the top level directory', function() {
            fs.hijack('readdirSync', function() {
                return ['1.js', '2.js', '3.js'];
            });
            fs.hijack('lstatSync', function() {
                return {
                    isDirectory: function() { return false; }
                };
            });

            var files = subject.getAllFiles({ basePath: 'testFiles' });
            expect(files[0]).toBe('1.js');
            expect(files[1]).toBe('2.js');
            expect(files[2]).toBe('3.js');
        });

        it('should return a list containing all files including subdirectories', function() {
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

            var files = subject.getAllFiles({ basePath: 'testFiles' });
            expect(files[3]).toBe('subDirectory/1.js');
            expect(files[4]).toBe('subDirectory/2.js');
            expect(files[5]).toBe('subDirectory/3.js');
        });

        it('should return a list containing all files excluding any items matching strings to exclude', function() {
            var subDirectory = 'subDirectory';

            fs.hijack('readdirSync', function(directory) {
                return directory.indexOf(subDirectory) === -1 ? ['1.js', '2.js', '3.js', '_cache.specs.js', subDirectory] :
                    ['1.js', '2.js', '3.js'];
            });
            fs.hijack('lstatSync', function(item) {
                return {
                    isDirectory: function() {
                        return item.indexOf(subDirectory) === item.length - subDirectory.length;
                    }
                };
            });

            var files = subject.getAllFiles({
                basePath: __dirname + '/testFiles/getAllFiles',
                exclude: ['subDirectory', 'specs.js']
            });

            expect(files.occurrencesOf('_cache.specs.js')).toBe(0);
            expect(files.occurrencesOf('subDirectory/1.js')).toBe(0);
        });

        it('should return a list containing all files matching the file ending', function() {
            fs.hijack('readdirSync', function() {
                return ['1.js', '2.js', '3.js'];
            });
            fs.hijack('lstatSync', function() {
                return {
                    isDirectory: function() { return false; }
                };
            });

            var files = subject.getAllFiles({
                basePath: 'testFiles',
                fileEnding: 'js'
            });
            expect(files.length).toBe(3);

            var files = subject.getAllFiles({
                basePath: 'testFiles',
                fileEnding: 'foobar'
            });
            expect(files.length).toBe(0);
        });

    });

});