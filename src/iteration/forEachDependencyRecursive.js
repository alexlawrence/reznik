'use strict';

var forEachModule = require('./forEachModule.js');

var forEachDependencyRecursive = function(modules, callback) {
    var dependency, allDependencies;
    forEachModule(modules, function(id, module) {
        allDependencies = module.dependencies.slice(0);
        while (allDependencies.length > 0) {
            if (allDependencies.indexOf(id) > -1) {
                throw new Error('circular dependency in ' + module.filename);
            }
            dependency = allDependencies.pop();
            if (modules[dependency] && modules[dependency].dependencies) {
                allDependencies = allDependencies.concat(modules[dependency].dependencies);
            }
            callback(id, dependency);
        }
    });
};

module.exports = forEachDependencyRecursive;