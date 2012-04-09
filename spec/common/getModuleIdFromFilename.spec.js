'use strict';

var testMethod = require('../../src/common/getModuleIdFromFilename.js');

describe('common/getModuleIdFromFilename', function() {

    it('should return a filename without file ending unmodified', function() {

        var result = testMethod('someModule');

        expect(result).toBe('someModule');

    });

    it('should remove the .js file ending from given filename', function() {

        var result = testMethod('someModule.js');

        expect(result).toBe('someModule');

    });

    it('should replace backslashes (\\) with forward slashes (/)', function() {

        var result = testMethod('some\\module');

        expect(result).toBe('some/module');

    });

    it('should chop off a filename which contains the string ".js"', function() {

        var result = testMethod('some.jsModule');

        expect(result).toBe('some.jsModule');

    });

});