'use strict';

var forSomeModules = require('../iteration/forSomeModules.js');

var renderDot = function(result) {
    var output = 'digraph dependencies {\n';
    forSomeModules(result.modules, function(id, module) {
        if(module.dependencies.length > 0) {
            module.dependencies.forEach(function(dependency) {
                output += '"' + id + '" -> "' + dependency + '";\n';
            });
        }
        else {
            output += '"' + id + '";\n';
        }
    });
    output += '}';
    return output;
};

module.exports = renderDot;