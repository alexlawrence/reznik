'use strict';

var firstOrNull = function(array, matches) {
    var result = null;
    array.some(function(value, index) {
        if (matches(value, index)) {
            result = value;
            return true;
        }
    });
    return result;
};

module.exports = firstOrNull;