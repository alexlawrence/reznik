'use strict';

var forEachDependencyRecursive = require('../iteration/forEachDependencyRecursive.js');
var forSomeModules = require('../iteration/forSomeModules.js');
var cloneModuleWithoutDependencies = require('./cloneModuleWithoutDependencies.js');

var flattenModuleList = function(modules) {
    var modulesFlattened = {};
    forSomeModules(modules, function(moduleId, moduleData) {
        modulesFlattened[moduleId] = cloneModuleWithoutDependencies(moduleData);
    });
    forEachDependencyRecursive(modules, function(moduleId, dependencyId) {
        if (modulesFlattened[moduleId].dependencies.indexOf(dependencyId) === -1) {
            modulesFlattened[moduleId].dependencies.push(dependencyId);
        }
    });
    return modulesFlattened;
};

module.exports = flattenModuleList;