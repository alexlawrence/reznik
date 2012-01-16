var subject = require('../../src/common/filesystem.js');

describe('filesystem', function() {

    describe('readFiles', function() {

        it('should throw an error when passing an invalid base path', function() {
            expect(function() {
                subject.readFiles('../....../.....', []);
            }).toThrow();

            expect(function() {
                subject.readFiles('../...adsasda.s.aadsdas', []);
            }).toThrow();
        });

        it('should not throw an error when passing a valid base path', function() {
            expect(function() {
                subject.readFiles(__dirname + '/testFiles/readFiles', []);
            }).not.toThrow();
        });

        it('should return correct the filepath names when given multiple files', function() {
            var files = subject.readFiles(__dirname + '/testFiles/readFiles',
                ['1.js', '2.js', '3.js', 'subDirectory/1.js', 'subDirectory/2.js', 'subDirectory/3.js']);

            expect(files.length).toBe(6);
            expect(files[5].relativeFilename).toBe('subDirectory/3.js');
        });

        it('should return correct file contents when given multiple files', function() {
            var files = subject.readFiles(__dirname + '/testFiles/readFiles',
                ['1.js', '2.js', '3.js', 'subDirectory/1.js', 'subDirectory/2.js', 'subDirectory/3.js']);

            expect(files.length).toBe(6);
            expect(files[5].contents).toBe('3');
        });

        it('should return correct file contents when given files with special characters', function() {
            var files = subject.readFiles(__dirname + '/testFiles/readFiles', ['utf-8.js']);

            expect(files[0].contents).toBe('äöü');
        });

    });

    describe('getAllFiles', function() {

        it('should throw an error when passing an invalid base path', function() {
            expect(function() {
                subject.getAllFiles('../....../.....');
            }).toThrow();

            expect(function() {
                subject.getAllFiles('../...adsasda.s.aadsdas');
            }).toThrow();
        });

        it('should not throw an error when passing a valid base path', function() {
            expect(function() {
                subject.getAllFiles({ basePath: __dirname + '/testFiles' });
            }).not.toThrow();
        });

        it('should return a list containing all files in the top level directory', function() {
            var files = subject.getAllFiles({ basePath: __dirname + '/testFiles/getAllFiles' });
            expect(files[0]).toBe('1.js');
            expect(files[1]).toBe('2.js');
            expect(files[2]).toBe('3.js');
        });

        it('should return a list containing all files including subdirectories', function() {
            var files = subject.getAllFiles({ basePath: __dirname + '/testFiles/getAllFiles' });
            expect(files[3]).toBe('subDirectory/1.js');
            expect(files[4]).toBe('subDirectory/2.js');
            expect(files[5]).toBe('subDirectory/3.js');
        });

        it('should return a list containing all files matching the file ending when given', function() {
            var files = subject.getAllFiles({
                basePath: __dirname + '/testFiles/getAllFiles',
                fileEnding: 'js'
            });
            expect(files.length).toBe(6);

            var files = subject.getAllFiles({
                basePath: __dirname + '/testFiles/getAllFiles',
                fileEnding: 'foobar'
            });
            expect(files.length).toBe(0);
        });

        it('should return a list containing all files excluding a single directories to exclude', function() {
            var files = subject.getAllFiles({
                basePath: __dirname + '/testFiles/getAllFiles',
                directoriesToExclude: ['subDirectory']
            });
            expect(files[0]).toBe('1.js');
            expect(files[1]).toBe('2.js');
            expect(files[2]).toBe('3.js');
            expect(files.length).toBe(3);
        });

        it('should return a list containing all files excluding a single directories to exclude', function() {
            var files = subject.getAllFiles({
                basePath: __dirname + '/testFiles/getAllFiles',
                directoriesToExclude: ['subDirectory']
            });
            expect(files[0]).toBe('1.js');
            expect(files[1]).toBe('2.js');
            expect(files[2]).toBe('3.js');
            expect(files.length).toBe(3);
        });

    });

});
