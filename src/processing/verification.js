'use strict';

var iteration = require('./iteration.js');

var checkMissingDependencies = function(evaluationResult) {
    var errors = evaluationResult.errors, modules = evaluationResult.modules;
    iteration.forEachModule(modules, function(moduleId, moduleData) {
        moduleData.dependencies.forEach(function(dependency) {
            if (!evaluationResult.modules[dependency]) {
                errors.push('missing dependency ' + dependency + ' required in ' + moduleId + '.js');
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

var executeAllAvailableChecks = function(evaluationResult) {
    checkMissingDependencies(evaluationResult);
    checkCircularDependencies(evaluationResult);
}

exports.checkMissingDependencies = checkMissingDependencies;
exports.checkCircularDependencies = checkCircularDependencies;
exports.executeAllAvailableChecks = executeAllAvailableChecks;