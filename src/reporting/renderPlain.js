'use strict';

var forEachProperty = require('../iteration/forEachProperty.js');
var forEachModule = require('../iteration/forEachModule.js');

var renderPlain = function(result) {
    var output = '';
    forEachProperty(result, function(value, property) {
        if (property == 'configuration') {
            return;
        }
        output += renderModuleDataOrInformation(value, property);
    });
    output += renderAnonymousModules(result.modules);
    return output;
};

var renderModuleDataOrInformation = function(value, property) {
    var output = '#' + property.replace('modules', 'files') + '\n';
    if (property.indexOf('modules') === 0) {
        forEachModule(value, function(id, module) {
            var dependantFilenames = getDependantFilenames(value, module.dependencies);
            output += module.filename + ':' + dependantFilenames.join(',') + '\n';
        })
    }
    else {
        value.forEach(function(valueItem) {
            output += valueItem + '\n';
        });
    }
    return output;
};

var getDependantFilenames = function(modules, dependencies) {
    var dependantFilenames = dependencies.map(function(dependency) {
        return modules[dependency] ? modules[dependency].filename : undefined;
    });
    dependantFilenames = dependantFilenames.filter(function(value) { return value !== undefined; });
    return dependantFilenames;
};

var renderAnonymousModules = function(modules) {
    var output = '#anonymous\n';
    forEachModule(modules, function(id, module) {
         if (module.anonymous) {
             output += module.filename + '\n';
         }
    });
    return output;
};

module.exports = renderPlain;