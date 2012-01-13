var subject = require('../src/amdProxy.js');

describe('amdProxy', function() {

    describe('evaluateFiles', function() {

        describe('when given no files', function() {

            it('should not throw an error when passing undefined', function() {
                expect(subject.evaluateFiles).not.toThrow();
            });

            it('should return an object containing an empty array of errors', function() {
                var result = subject.evaluateFiles();
                expect(typeof result.errors.length).toBe('number');
                expect(result.errors.length).toBe(0);
            });

            it('should return an object containing a empty hash array of modules', function() {
                var result = subject.evaluateFiles();
                expect(typeof result.modules).toBe('object');
            });


        });

        describe('when given any javascript files', function() {

            it('should evaluate javascript in its own sandbox without access to node context', function() {
                global.executedFiles = { one: false, two: false, three: false };
                var files = [];
                files.push({
                    relativeFilename: 'one.js',
                    contents: 'global.executedFiles.one = true;'
                });
                files.push({
                    relativeFilename: 'two.js',
                    contents: 'global.executedFiles.two = true;'
                });
                files.push({
                    relativeFilename: 'three.js',
                    contents: 'global.executedFiles.three = true;'
                });

                subject.evaluateFiles(files);

                expect(global.executedFiles.one).toBeFalsy();
                expect(global.executedFiles.two).toBeFalsy();
                expect(global.executedFiles.three).toBeFalsy();
            });

            it('should not rethrow any errors in evaluated javascript file content', function() {
                var files = [];
                files.push({
                    relativeFilename: 'one.js',
                    contents: 'window.foobar.foobar = "foobar";'
                });
                files.push({
                    relativeFilename: 'two.js',
                    contents: 'asdf.asdf::asdf;;;asdf'
                });
                files.push({
                    relativeFilename: 'three.js',
                    contents: '???###:::;;;'
                });

                expect(function() { subject.evaluateFiles(files); }).not.toThrow();
            });

            it ('should abort a single file evaluation after the first javascript error', function() {
                var files = [];
                files.push({
                    relativeFilename: 'one.js',
                    contents: 'foobar.foobar = "foobar"; define("a", function() {});'
                });
                var evaluationResult = subject.evaluateFiles(files);

                expect(evaluationResult.modules['a']).toBeUndefined();
            });

        });

        describe('when given amd modules using define', function() {

            it('should include a module in the result even if it has no dependencies', function() {
                var files = [];
                files.push({
                    relativeFilename: 'one.js',
                    contents: 'define("one", function() {});'
                });

                var result = subject.evaluateFiles(files);

                expect(result.modules.one).toBeDefined();
                expect(result.modules.one.length).toBe(0);
            });

            it('should include a module in the result with its dependencies', function() {
                var files = [];
                files.push({
                    relativeFilename: 'one.js',
                    contents: 'define("one", ["two", "three", "four/four/four"], function() {});'
                });

                var result = subject.evaluateFiles(files);

                expect(result.modules.one).toBeDefined();
                expect(result.modules.one.length).toBe(3);
                expect(result.modules.one[0]).toBe('two');
                expect(result.modules.one[1]).toBe('three');
                expect(result.modules.one[2]).toBe('four/four/four');
            });

            it('should return an error when a module does not provide an id', function() {
                var files = [];
                files.push({
                    relativeFilename: 'one.js',
                    contents: 'define(["two", "three"], function() {});'
                });
                files.push({
                    relativeFilename: 'two.js',
                    contents: 'define(function() {});'
                });

                var result = subject.evaluateFiles(files);

                expect(result.errors.length).toBe(2);
                expect(result.errors[0]).toBe('anonymous module definition in one.js');
                expect(result.errors[1]).toBe('anonymous module definition in two.js');
            });

            it('should not include its dependencies when a module does not provide an id', function() {
                var files = [];
                files.push({
                    relativeFilename: 'one.js',
                    contents: 'define(["two", "three"], function() {});'
                });

                var result = subject.evaluateFiles(files);

                expect(result.modules.one).toBeUndefined();
            });

            it('should not execute the factory of a module', function() {
                global.executedFiles = { one: false };
                var files = [];
                files.push({
                    relativeFilename: 'one.js',
                    contents: 'define("one", ["two", "three"], function() { global.executedFiles.one = true; });'
                });

                subject.evaluateFiles(files);

                expect(global.executedFiles.one).toBeFalsy();
            });

            it('should not execute the factory of a module when it has no dependencies', function() {
                global.executedFiles = { one: false };
                var files = [];
                files.push({
                    relativeFilename: 'one.js',
                    contents: 'define("one", function() { global.executedFiles.one = true; });'
                });

                subject.evaluateFiles(files);

                expect(global.executedFiles.one).toBeFalsy();
            });

            it('should not add nested requires inside the factory to the module dependencies', function() {
                var files = [];
                files.push({
                    relativeFilename: 'one.js',
                    contents: 'define("one", function() { ' +
                        'require(["two/two/two"], function() {});' +
                        'require(["three/three/three"], function() {});' +
                        'require(["four/four/four"], function() {});' +
                        '});'
                });

                var result = subject.evaluateFiles(files);

                expect(result.modules.one).toBeDefined();
                expect(result.modules.one.length).toBe(0);
            });

            it('should not return an error when a module id matches the relative filepath', function() {
                var files = [];
                files.push({
                    relativeFilename: 'path/to/one/module.js',
                    contents: 'define("path/to/one/module", function() {});'
                });

                var result = subject.evaluateFiles(files);

                expect(result.errors.length).toBe(0);
            });

            it('should return an error when a module id does not match the relative filepath', function() {
                var files = [];
                files.push({
                    relativeFilename: 'path/to/one/module.js',
                    contents: 'define("wrong/path/to/one/module", function() {});'
                });

                var result = subject.evaluateFiles(files);

                expect(result.errors.length).toBe(1);
                expect(result.errors[0]).toBe('mismatching module id and relative filepath in path/to/one/module.js');
            });

            it('should correct the relative filepath and not throw an error when using windows path (\\)', function() {
                var files = [];
                files.push({
                    relativeFilename: 'path\\to\\one\\module.js',
                    contents: 'define("path/to/one/module", function() {});'
                });

                var result = subject.evaluateFiles(files);

                expect(result.errors.length).toBe(0);
            });

            it('should return an error when a module contains multiple identical defines', function() {
                var files = [];
                files.push({
                    relativeFilename: 'path/to/one/module.js',
                    contents: 'define("path/to/one/module", function() {});' +
                        'define("path/to/one/module", function() {});'
                });

                var result = subject.evaluateFiles(files);

                expect(result.errors.length).toBe(1);
                expect(result.errors[0]).toBe('duplicate module definition in path/to/one/module.js');
            });

        });

        describe('when given javascript files using require', function() {

            it('should generate an implicit module id from relative filepath', function() {
                var files = [];
                files.push({
                    relativeFilename: 'path/to/module/one.js',
                    contents: 'require(["two", "three"], function() {});'
                });

                var result = subject.evaluateFiles(files);
                expect(result.modules['path/to/module/one']).toBeDefined();
            });

            it('should include all dependencies for implicit module ids', function() {
                var files = [];
                files.push({
                    relativeFilename: 'path/to/module/one.js',
                    contents: 'require(["two", "three"], function() {});'
                });

                var result = subject.evaluateFiles(files);
                expect(result.modules['path/to/module/one'][0]).toBe('two');
                expect(result.modules['path/to/module/one'][1]).toBe('three');
            });

            it('should execute the factory', function() {
                global.executedFiles = { one: false };
                var files = [];
                files.push({
                    relativeFilename: 'path/to/module/one.js',
                    contents: 'require(["two", "three"], function() { global.executedFiles.one = true; });'
                });

                expect(global.executedFiles).toBeTruthy();
            });

            it('should execute the factory when the module has no dependencies', function() {
                global.executedFiles = { one: false };
                var files = [];
                files.push({
                    relativeFilename: 'path/to/module/one.js',
                    contents: 'require(function() { global.executedFiles.one = true; });'
                });

                expect(global.executedFiles).toBeTruthy();
            });

            it('should not include dependencies from nested requires', function() {
                var files = [];
                files.push({
                    relativeFilename: 'path/to/module/one.js',
                    contents: 'require(["two"], function() { require(["three"], function() {}); });'
                });

                var result = subject.evaluateFiles(files);
                expect(result.modules['path/to/module/one'].length).toBe(1);
                expect(result.modules['path/to/module/one'][0]).toBe('two');
            });

            it('should not evaluate CommonJS require calls', function() {
                var files = [];
                files.push({
                    relativeFilename: 'path/to/module/one.js',
                    contents: 'require("two");'
                });

                var result = subject.evaluateFiles(files);
                expect(result.modules['path/to/module/one']).toBeUndefined();
            });

        });

    });

});