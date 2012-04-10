'use strict';

var forEachModule = require('../iteration/forEachModule.js');
var cloneModuleWithoutDependencies = require('./cloneModuleWithoutDependencies.js');

var generateInvertedModuleList = function(modules) {
    var modulesInverted = {};
    forEachModule(modules, function(moduleId, moduleData) {
        modulesInverted[moduleId] = cloneModuleWithoutDependencies(moduleData);
    });
    forEachModule(modules, function(moduleId, moduleData) {
        moduleData.dependencies.forEach(function(dependencyId) {
            if (!modulesInverted[dependencyId]) {
                modulesInverted[dependencyId] = {dependencies: []};
            }
            modulesInverted[dependencyId].dependencies.push(moduleId);
        });
    });
    return modulesInverted;
};

module.exports = generateInvertedModuleList;