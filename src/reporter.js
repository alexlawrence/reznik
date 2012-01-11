var iteration = require('./iteration.js');

var toJSON = function(evaluationResult) {
    return JSON.stringify(evaluationResult);
}

var toXML = function(evaluationResult) {
    var output = '<evaluationResult>';
    output += '<modules>';
    iteration.forEachModule(evaluationResult.modules, function(moduleId, dependencyIds) {
        output += '<module id="' + moduleId + '">';
        dependencyIds.forEach(function(dependencyId) {
            output += '<dependency>' + dependencyId + '</dependency>';
        })
        output += '</module>';
    });
    output += '</modules>';
    output += '<errors>';
    evaluationResult.errors.forEach(function(error) {
        output += '<error>' + error + '</error>';
    });
    output += '</errors>';
    output += '</evaluationResult>';
    return output;
};

var toPlain = function(evaluationResult) {
    var output = '';
    output += 'modules:\n';
    iteration.forEachModule(evaluationResult.modules, function(moduleId, dependencyIds) {
        dependencyIds.forEach(function(dependencyId) {
            output += moduleId + ' ' + dependencyId + '\n';
        });
        if (dependencyIds.length === 0) {
            output += moduleId + '\n';
        }
    });
    output += 'errors:\n';
    evaluationResult.errors.forEach(function(error) {
        output += error + '\n';
    });
    return output;
}

var reporterByType = {
    'json': toJSON,
    'xml': toXML,
    'plain': toPlain
}

var to = function(type, evaluationResult) {
    return reporterByType[type](evaluationResult);
}

exports.toJSON = toJSON;
exports.toXML = toXML;
exports.toPlain = toPlain;
exports.to = to;