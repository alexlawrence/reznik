'use strict';

var testMethod = require('../../src/filesystem/matchesFileEnding.js');

describe('filesystem/matchesFileEnding', function() {

    it('should return true when given no ending', function() {

        var result = testMethod('filename.js');

        expect(result).toBeTruthy();

    });

    it('should return false when given ending does not match ending of given filename', function() {

        var result = testMethod('filename.js', 'txt');

        expect(result).toBeFalsy();

    });

    it('should return true when given ending matches ending of given filename', function() {

        var result = testMethod('filename.js', 'js');

        expect(result).toBeTruthy();

    });

});