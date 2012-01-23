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

Array.prototype.occurrencesOf = function(toSearch) {
    return occurrencesOf(this, toSearch);
};

exports.occurrencesOf = occurrencesOf;