'use strict';

var forEachModule = function(modules, callback) {
    if (!modules) {
        return;
    }
    var id, dependencies, shouldAbort;
    for (id in modules) {
        modules[id].dependencies = modules[id].dependencies || [];
        shouldAbort = callback(id, modules[id]);
        if (shouldAbort) {
            return;
        }
    }
};

var forEachModuleDependencyRecursive = function(modules, callback) {
    var dependency, allDependencies;
    forEachModule(modules, function(moduleId, moduleData) {
        allDependencies = moduleData.dependencies.slice(0);
        while (allDependencies.length > 0) {
            if (allDependencies.indexOf(moduleId) > -1) {
                throw new Error('circular dependency in ' + moduleId);
            }
            dependency = allDependencies.pop();
            if (modules[dependency] && modules[dependency].dependencies) {
                allDependencies = allDependencies.concat(modules[dependency].dependencies);
            }
            callback(moduleId, dependency);
        }
    });
};

exports.forEachModule = forEachModule;
exports.forEachModuleDependencyRecursive = forEachModuleDependencyRecursive;