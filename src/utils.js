var forEachModule = function(modules, callback) {
    var moduleId, dependencyIds;
    for (moduleId in modules) {
        if (modules.hasOwnProperty(moduleId)) {
            dependencyIds = modules[moduleId] || [];
            callback(moduleId, dependencyIds);
        }
    }
};

var flattenDependencies = function(dependencies) {
    return dependencies;
};

exports.forEachModule = forEachModule;
exports.flattenDependencies = flattenDependencies;