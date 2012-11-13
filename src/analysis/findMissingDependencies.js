'use strict';

var firstOrNull = require('../common/firstOrNull.js');

var findMissingDependencies = function(evaluationResult) {
    var errors = evaluationResult.errors, scripts = evaluationResult.scripts;
    scripts.forEach(function(script) {
        script.dependencies.forEach(function(dependencyId) {
            var dependency = firstOrNull(scripts, function(x) {
                return x.type === 'module' && x.id === dependencyId;
            });
            if (!dependency) {
                errors.push('missing dependency ' + dependencyId + ' required in ' + script.filename);
            }
        });
    });
};

module.exports = findMissingDependencies;