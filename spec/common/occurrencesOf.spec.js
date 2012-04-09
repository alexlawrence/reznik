'use strict';

var testMethod = require('../../src/common/occurrencesOf.js');

describe('common/occurrencesOf', function() {

    it('should return zero when given an empty array', function() {

        var result = testMethod([], 'foobar');

        expect(result).toBe(0);

    });

    it('should return zero when given an array which does not contain the object to match', function() {

        var result = testMethod(['foo', 'bar'], 'foobar');

        expect(result).toBe(0);

    });

    it('should return one when given an array which contains the object to match once', function() {

        var result = testMethod(['foobar'], 'foobar');

        expect(result).toBe(1);

    });

    it('should return two when given an array which contains the object to match twice', function() {

        var result = testMethod(['foobar', 'foobar'], 'foobar');

        expect(result).toBe(2);

    });

});