Array.prototype.occurrencesOf = function (toSearch) {
    var occurrences = 0;
    this.forEach(function(value) {
         if (toSearch === value) {
             occurrences++;
         }
    });
    return occurrences;
}