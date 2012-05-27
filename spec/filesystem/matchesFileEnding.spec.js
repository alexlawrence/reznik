'use strict';

var testMethod = require('../../src/filesystem/matchesFileEnding.js');

describe('filesystem/matchesFileEnding', function() {

    describe('when given no ending', function() {

        it('should return true', function() {

            var result = testMethod('filename.js');

            expect(result).toBeTruthy();

        });

    });

    describe('when given an ending and a filename without that ending', function() {

        it('should return false', function() {

            var result = testMethod('filename.js', 'txt');

            expect(result).toBeFalsy();

        });

    });

    describe('when given an ending and a filename with that ending', function() {

        it('should return true', function() {

            var result = testMethod('filename.js', 'js');

            expect(result).toBeTruthy();

        });

    });

});