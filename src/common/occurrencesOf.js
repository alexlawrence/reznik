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

occurrencesOf.installAsPrototype = function() {
    Array.prototype.occurrencesOf = function(toSearch) {
        return occurrencesOf(this.valueOf(), toSearch);
    }
};

module.exports = occurrencesOf;