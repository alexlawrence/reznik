'use strict';

var firstOrNull = require('../../src/common/firstOrNull.js');

describe('common/firstOrNull', function() {

    it('should return the first array item if the matches callback always returns true', function() {

        var input = [1, 2];

        var result = firstOrNull(input, function() { return true; });

        expect(result).toBe(1);

    });

    it('should return null if the matches callback returns false', function() {

        var input = [1, 2];

        var result = firstOrNull(input, function() { return false; });

        expect(result).toBe(null);

    });

    it('should pass each array item and its index to the matches callback', function() {

        var first = {a: 1};
        var second = {a: 1};
        var input = [first, second];

        var spy = jasmine.createSpy('matches');

        var result = firstOrNull(input, spy);

        expect(spy).toHaveBeenCalledWith(first, 0);
        expect(spy).toHaveBeenCalledWith(second, 1);

    });

    it('should return the first item of an array where the matches callback returns true', function() {

        var first = {a: 1};
        var second = {a: 1};
        var input = [first, second];

        var result = firstOrNull(input, function(item) { return item.a == 1; });

        expect(result).toBe(first);
        expect(result).not.toBe(second);

    });

});