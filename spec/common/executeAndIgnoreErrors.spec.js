'use strict';

var subject = require('../../src/common/executeAndIgnoreErrors.js');

describe('common/executeAndIgnoreErrors', function() {

    it('should not throw an error when the callback produces an error', function() {

        expect(function() {
            subject(function() {
                foobar.foobar = 'foobar';
            });
        }).not.toThrow();

    });

});