'use strict';

var firstOrNull = function(array, matches) {
    var result = null;
    array.some(function(value, index) {
        if (matches(value, index)) {
            result = value;
            return true;
        }
        return false;
    });
    return result;
};

module.exports = firstOrNull;