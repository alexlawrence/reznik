'use strict';

var forEach = require('../common/objectForEach.js').forEach;
var iteration = require('../processing/iteration.js');

var render = function(result) {
    var output = 'digraph dependencies {\n';
    iteration.forEachModule(result.modules, function(moduleId, moduleData) {
        if(moduleData.dependencies.length > 0) {
            moduleData.dependencies.forEach(function(dependency) {
                output += '"' + moduleId + '" -> "' + dependency + '";\n';
            });
        }
        else {
            output += '"' + moduleId + '";\n';
        }
    });
    output += '}';
    return output;
};

exports.render = render;