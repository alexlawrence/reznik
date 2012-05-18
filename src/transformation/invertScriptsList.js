'use strict';

var cloneScriptWithoutDependencies = require('./cloneScriptWithoutDependencies.js');
var firstOrNull = require('../common/firstOrNull.js');

var invertScriptsList = function(scripts) {
    var scriptsInverted = scripts.map(function(script) {
        return cloneScriptWithoutDependencies(script);
    });
    scripts.forEach(function(script) {
        script.dependencies.forEach(function(id) {
            var dependency = firstOrNull(scriptsInverted, function(x) { return x.id == id});
            if (dependency) {
                dependency.dependencies.push(script.id);
            }
        });
    });
    return scriptsInverted;
};

module.exports = invertScriptsList;