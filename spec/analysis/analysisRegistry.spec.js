'use strict';

var subject = require('../../src/analysis/analysisRegistry.js');

describe('analysis/analysisRegistry', function() {

    describe('getAnalysisByName', function() {

        var testMethod = subject.getAnalysisByName;

        it('should always return a function', function() {

            var result = testMethod();
            expect(typeof result).toBe('function');

        });

    });

});