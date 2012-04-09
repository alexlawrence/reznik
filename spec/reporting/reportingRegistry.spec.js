'use strict';

var subject = require('../../src/reporting/reportingRegistry.js');

describe('reporting/reportingRegistry', function() {

    describe('getRendererByOutput', function() {

        var testMethod = subject.getRendererByOutput;

        it('should always return a function', function() {

            var result = testMethod();
            expect(typeof result).toBe('function');

        });

    });

});