'use strict';

var forSomeModules = require('../iteration/forSomeModules.js');

var findCaseMismatches = function(evaluationResult) {
    var errors = evaluationResult.errors, modules = evaluationResult.modules;
    forSomeModules(modules, function(id, module) {
        var idWithEnding = id + '.js';
        var filename = module.filename;
        if ((idWithEnding.toLowerCase() == filename.toLowerCase()) && (idWithEnding != filename)) {
            errors.push('id and filename case mismatch in ' + module.filename);
        }
    });
};

module.exports = findCaseMismatches;