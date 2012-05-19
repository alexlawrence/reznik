'use strict';

var forEachModule = require('../iteration/forEachModule.js');

var findDuplicateIds = function(evaluationResult) {
    var errors = evaluationResult.errors, scripts = evaluationResult.scripts;
    var modulesById = {};
    forEachModule(scripts, function(script) {
        if (modulesById[script.id]) {
            errors.push('duplicate module id in ' + script.filename + ' and ' + modulesById[script.id].filename);
        }
        modulesById[script.id] = script;
    });
};

module.exports = findDuplicateIds;