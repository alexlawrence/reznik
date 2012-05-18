'use strict';

var forEachModule = require('../iteration/forEachModule.js');

var findCaseMismatches = function(evaluationResult) {
    var errors = evaluationResult.errors, scripts = evaluationResult.scripts;
    forEachModule(scripts, function(script) {
        var idWithEnding = script.id + '.js';
        var filename = script.filename;
        if ((idWithEnding.toLowerCase() == filename.toLowerCase()) && (idWithEnding != filename)) {
            errors.push('id and filename case mismatch in ' + script.filename);
        }
    });
};

module.exports = findCaseMismatches;