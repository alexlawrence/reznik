'use strict';

var forEachDependencyRecursive = require('../iteration/forEachDependencyRecursive.js');
var cloneScriptWithoutDependencies = require('./cloneScriptWithoutDependencies.js');
var firstOrNull = require('../common/firstOrNull.js');

var flattenScriptsList = function(scripts) {
    var scriptsFlattened = scripts.map(function(script) {
        return cloneScriptWithoutDependencies(script);
    });
    forEachDependencyRecursive(scripts, function(script, dependencyId) {
        var scriptFlattened = firstOrNull(scriptsFlattened, function(x) { return x.filename == script.filename; });
        if (scriptFlattened && scriptFlattened.dependencies.indexOf(dependencyId) === -1) {
            scriptFlattened.dependencies.push(dependencyId);
        }
    });
    return scriptsFlattened;
};

module.exports = flattenScriptsList;