var iteration = require('../src/iteration.js');

var checkMissingDependencies = function(evaluationResult) {
    var errors = evaluationResult.errors, modules = evaluationResult.modules;
    iteration.forEachModule(modules, function(moduleId, dependencyIds) {
        dependencyIds.forEach(function(dependencyId) {
            if (!evaluationResult.modules[dependencyId]) {
                errors.push('missing dependency ' + dependencyId + ' required in ' + moduleId + '.js');
            }
        });
    });
};

var checkCircularDependencies = function(evaluationResult) {
    try {
        iteration.forEachModuleDependencyRecursive(evaluationResult.modules, function() {});
    }
    catch (error) {
        evaluationResult.errors.push(error.message + '.js');
    }
};

exports.checkMissingDependencies = checkMissingDependencies;
exports.checkCircularDependencies = checkCircularDependencies;