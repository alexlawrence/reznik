'use strict';

var forSomeModules = require('../iteration/forSomeModules.js');

var findMissingDependencies = function(evaluationResult) {
    var errors = evaluationResult.errors, modules = evaluationResult.modules;
    forSomeModules(modules, function(id, module) {
        module.dependencies.forEach(function(dependency) {
            if (!evaluationResult.modules[dependency]) {
                errors.push('missing dependency ' + dependency + ' required in ' + module.filename);
            }
        });
    });
};

module.exports = findMissingDependencies;