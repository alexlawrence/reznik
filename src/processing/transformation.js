'use strict';

var iteration = require('./iteration.js');

var generateFlattenedModuleList = function(modules) {
    var modulesFlattened = {};
    iteration.forEachModule(modules, function(moduleId, moduleData) {
        modulesFlattened[moduleId] = cloneModuleWithoutDependencies(moduleData);
    });
    iteration.forEachModuleDependencyRecursive(modules, function(moduleId, dependencyId) {
        if (modulesFlattened[moduleId].dependencies.indexOf(dependencyId) === -1) {
            modulesFlattened[moduleId].dependencies.push(dependencyId);
        }
    });
    return modulesFlattened;
};

var generateInvertedModuleList = function(modules) {
    var modulesInverted = {};
    iteration.forEachModule(modules, function(moduleId, moduleData) {
        modulesInverted[moduleId] = cloneModuleWithoutDependencies(moduleData);
    });
    iteration.forEachModule(modules, function(moduleId, moduleData) {
        moduleData.dependencies.forEach(function(dependencyId) {
            if (!modulesInverted[dependencyId]) {
                modulesInverted[dependencyId] = {dependencies: []};
            }
            modulesInverted[dependencyId].dependencies.push(moduleId);
        });
    });
    return modulesInverted;
};

var cloneModuleWithoutDependencies = function(moduleData) {
    return {
        dependencies: [],
        filename: moduleData.filename,
        anonymous: moduleData.anonymous
    }
}

exports.generateFlattenedModuleList = generateFlattenedModuleList;
exports.generateInvertedModuleList = generateInvertedModuleList;