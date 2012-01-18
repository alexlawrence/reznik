'use strict';

var forEachModule = function(modules, callback) {
    var moduleId, dependencyIds, shouldAbort;
    for (moduleId in modules) {
        dependencyIds = modules[moduleId] || [];
        shouldAbort = callback(moduleId, dependencyIds);
        if (shouldAbort) {
            return;
        }
    }
};

var forEachModuleDependencyRecursive = function(modules, callback) {
    var dependencyId, allDependencyIds;
    forEachModule(modules, function(moduleId, dependencyIds) {
        allDependencyIds = dependencyIds.slice(0);
        while (allDependencyIds.length > 0) {
            if (allDependencyIds.indexOf(moduleId) > -1) {
                throw new Error('circular dependency in ' + moduleId);
            }
            dependencyId = allDependencyIds.pop();
            allDependencyIds = allDependencyIds.concat(modules[dependencyId] || []);
            callback(moduleId, dependencyId);
        }
    });
};

exports.forEachModule = forEachModule;
exports.forEachModuleDependencyRecursive = forEachModuleDependencyRecursive;