'use strict';

var occurrencesOf = function (array, toSearch) {
    var occurrences = 0;
    array.forEach(function(value) {
         if (toSearch === value) {
             occurrences++;
         }
    });
    return occurrences;
};

module.exports = occurrencesOf;