'use strict';

var forSomeModules = require('../iteration/forSomeModules.js');
var cloneModuleWithoutDependencies = require('./cloneModuleWithoutDependencies.js');

var generateInvertedModuleList = function(modules) {
    var modulesInverted = {};
    forSomeModules(modules, function(moduleId, moduleData) {
        modulesInverted[moduleId] = cloneModuleWithoutDependencies(moduleData);
    });
    forSomeModules(modules, function(moduleId, moduleData) {
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