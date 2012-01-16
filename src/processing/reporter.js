var iteration = require('./iteration.js');
var forEach = require('../common/iteration.js').forEach;

var toJSON = function(evaluationResult) {
    return JSON.stringify(evaluationResult);
}

var toPlain = function(result) {
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

var reporterByType = {
    'json': toJSON,
    'plain': toPlain
};

var to = function(type, evaluationResult) {
    return reporterByType[type](evaluationResult);
};

exports.toJSON = toJSON;
exports.toPlain = toPlain;
exports.to = to;