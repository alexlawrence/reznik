var forEach = require('../common/objectForEach.js').forEach;
var iteration = require('../processing/iteration.js');

var render = function(result) {
    var output = 'digraph dependencies {\n';
    forEach(result.modules, function(dependencyIds, moduleId) {
        if(dependencyIds.length > 0) {
            dependencyIds.forEach(function(dependency) {
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