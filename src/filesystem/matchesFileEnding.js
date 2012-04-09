'use strict';

var matchesFileEnding = function(file, ending) {
    if (!ending) {
        return true;
    }
    var endingPlusDot = '.' + ending;
    return file.toLowerCase().indexOf(endingPlusDot) === file.length - endingPlusDot.length;
};

module.exports = matchesFileEnding;