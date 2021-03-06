'use strict';

var forEachModule = require('../iteration/forEachModule.js');

var fileEnding = '.js';

var findAbsoluteIdsWithoutPaths = function(evaluationResult) {
    var errors = evaluationResult.errors;
    var paths = evaluationResult.configuration.paths || {};
    forEachModule(evaluationResult.scripts, function(module) {
        var idWithEnding = module.id + fileEnding;
        if (idWithEnding.toLowerCase() !== module.filename.toLowerCase()) {
            var filename = resolveFilename(module.id, paths);
            if (filename !== module.filename) {
                errors.push('id and filename mismatch in ' + module.filename);
            }
        }
    });
};

var resolveFilename = function(id, paths) {
    for (var key in paths) {
        if (paths.hasOwnProperty(key) && id.indexOf(key) === 0) {
            return id.replace(key, paths[key]) + fileEnding;
        }
    }
    return '';
};

module.exports = findAbsoluteIdsWithoutPaths;