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
    evaluationResult.errors && evaluationResult.errors.forEach(function(error) {
        output += '<error>' + error + '</error>';
    });
    output += '</errors>';
    output += '<information>';
    evaluationResult.information && evaluationResult.information.forEach(function(message) {
        output += '<message>' + message + '</message>';
    });
    output += '</information>';
    output += '</evaluationResult>';
    return output;
};

var toPlain = function(evaluationResult) {
    var output = '';
    output += '#modules\n';
    iteration.forEachModule(evaluationResult.modules, function(moduleId, dependencyIds) {
        output += moduleId + ':' + dependencyIds.join(',') + '\n';
    });
    output += '#errors\n';
    evaluationResult.errors && evaluationResult.errors.forEach(function(error) {
        output += error + '\n';
    });
    output += '#information\n';
    evaluationResult.information && evaluationResult.information.forEach(function(message) {
        output += message + '\n';
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