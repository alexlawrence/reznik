var utils = require('./utils.js');

var toJSON = function(evaluationResult) {
    return JSON.stringify(evaluationResult);
}

var toXML = function(evaluationResult) {
    var output = '<evaluationResult>';
    output += '<modules>';
    forEachModule(evaluationResult.modules, function(moduleId, dependencyIds) {
        output += '<module id="' + moduleId + '">';
        dependencyIds.forEach(function(dependencyId) {
            output += '<dependency id="' + dependencyId + '" />';
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
}