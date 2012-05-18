'use strict';

var firstOrNull = require('../common/firstOrNull.js');

var forEachDependencyRecursive = function(scripts, callback) {
    var dependency, dependencyId, allDependencyIds;
    scripts.forEach(function(script) {
        allDependencyIds = script.dependencies.slice(0);
        while (allDependencyIds.length > 0) {
            if (allDependencyIds.indexOf(script.id) > -1) {
                throw new Error('circular dependency in ' + script.filename);
            }
            dependencyId = allDependencyIds.pop();
            dependency = firstOrNull(scripts, function(x) { return x.id == dependencyId; });
            if (dependency && dependency.dependencies) {
                allDependencyIds = allDependencyIds.concat(dependency.dependencies);
            }
            callback(script, dependencyId);
        }
    });
};

module.exports = forEachDependencyRecursive;