var iteration = require('./iteration.js');

var flattenDependencies = function(modules) {
    var flattenedModules = {};
    iteration.forEachModuleDependencyRecursive(modules, function(moduleId, dependencyId) {
        if (!flattenedModules[moduleId]) {
            flattenedModules[moduleId] = [];
        }
        flattenedModules[moduleId].push(dependencyId);
    });
    overwriteObjectProperties(modules, flattenedModules);
};

var overwriteObjectProperties = function (a, b) {
    for (property in b) {
        if (b.hasOwnProperty(property)) {
            a[property] = b[property];
        }
    }
}

exports.flattenDependencies = flattenDependencies;