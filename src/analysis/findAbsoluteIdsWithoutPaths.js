'use strict';

var forEachModule = require('../iteration/forEachModule.js');

var fileEnding = '.js';

var findAbsoluteIdsWithoutPaths = function(evaluationResult) {
    var errors = evaluationResult.errors;
    var paths = evaluationResult.configuration.paths || {};
    forEachModule(evaluationResult.modules, function(id, module) {
        var idWithEnding = id + fileEnding;
        if (idWithEnding.toLowerCase() != module.filename.toLowerCase()) {
            var filename = resolveFilename(id, paths);
            if (filename != module.filename) {
                errors.push('id and filename mismatch in ' + module.filename);
            }
        }
    });
};

var resolveFilename = function(id, paths) {
    for (var key in paths) {
        if (paths.hasOwnProperty(key) && id.indexOf(key) == 0) {
            return id.replace(key, paths[key]) + fileEnding;
        }
    }
};

module.exports = findAbsoluteIdsWithoutPaths;