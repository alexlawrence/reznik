'use strict';

var renderDot = function(result) {
    var output = 'digraph dependencies {\n';
    result.scripts.forEach(function(script) {
        var displayName = (script.id || script.filename);
        if(script.dependencies.length > 0) {
            script.dependencies.forEach(function(dependency) {
                output += '"' + displayName + '" -> "' + dependency + '";\n';
            });
        }
        else {
            output += '"' + displayName + '";\n';
        }
    });
    output += '}';
    return output;
};

module.exports = renderDot;