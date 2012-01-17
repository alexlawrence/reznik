var iteration = require('./iteration.js');

var generateFlattenedModuleList = function(modules) {
    var modulesFlattened = {};
    iteration.forEachModule(modules, function(moduleId) { modulesFlattened[moduleId] = []; });
    iteration.forEachModuleDependencyRecursive(modules, function(moduleId, dependencyId) {
        if (modulesFlattened[moduleId].indexOf(dependencyId) === -1) {
            modulesFlattened[moduleId].push(dependencyId);
        }
    });
    return modulesFlattened;
};

var generateInvertedModuleList = function(modules) {
    var modulesInverted = {};
    iteration.forEachModule(modules, function(moduleId) { modulesInverted[moduleId] = []; });
    iteration.forEachModule(modules, function(moduleId, dependencies) {
        dependencies.forEach(function(dependencyId) {
            modulesInverted[dependencyId] || (modulesInverted[dependencyId] = []);
            modulesInverted[dependencyId].push(moduleId);
        });
    });
    return modulesInverted;
};

exports.generateFlattenedModuleList = generateFlattenedModuleList;
exports.generateInvertedModuleList = generateInvertedModuleList;