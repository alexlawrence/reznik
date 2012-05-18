'use strict';

var forEachProperty = require('../iteration/forEachProperty.js');

var renderPlain = function(result) {
    var output = '';
    forEachProperty(result, function(value, property) {
        if (property == 'configuration') {
            return;
        }
        output += renderScriptsDataOrInformation(value, property);
    });
    output += renderAnonymousModules(result.scripts);
    return output;
};

var renderScriptsDataOrInformation = function(scriptsOrInformation, property) {
    var output = '#' + property.replace('scripts', 'files') + '\n';
    if (property.indexOf('scripts') === 0) {
        scriptsOrInformation.forEach(function(script) {
            var dependantFilenames = getDependantFilenames(scriptsOrInformation, script.dependencies);
            output += script.filename + ':' + dependantFilenames.join(',') + '\n';
        });
    }
    else {
        scriptsOrInformation.forEach(function(item) {
            output += item + '\n';
        });
    }
    return output;
};

var getDependantFilenames = function(scripts, dependencies) {
    var dependantFilenames = dependencies.map(function(id) { return findModuleById(scripts, id).filename; });
    dependantFilenames = dependantFilenames.filter(function(value) { return value !== undefined; });
    return dependantFilenames;
};

var findModuleById = function(scripts, id) {
    return scripts.filter(function(script) { return script.id == id; })[0] || {};
};

var renderAnonymousModules = function(scripts) {
    var output = '#anonymous\n';
    scripts.forEach(function(script) {
         if (script.anonymous) {
             output += script.filename + '\n';
         }
    });
    return output;
};

module.exports = renderPlain;