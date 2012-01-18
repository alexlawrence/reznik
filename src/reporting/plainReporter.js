var forEach = require('../common/objectForEach.js').forEach;
var iteration = require('../processing/iteration.js');

var render = function(result) {
    var output = '';
    forEach(result, function(value, property) {
        output += '#' + property + '\n';
        if (property.indexOf('modules') === 0) {
            value && iteration.forEachModule(value, function(moduleId, dependencyIds) {
                output += moduleId + ':' + dependencyIds.join(',') + '\n';
            });
        }
        else {
            value && value.forEach(function(valueItem) {
                output += valueItem + '\n';
            });
        }
    });
    return output;
};

exports.render = render;