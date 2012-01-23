'use strict';

var forEach = require('../common/objectForEach.js').forEach;
var iteration = require('../processing/iteration.js');

var render = function(result) {
    var output = '';
    forEach(result, function(value, property) {
        output += renderModuleDataOrInformation(value, property);
    });
    output += renderAnonymousModules(result.modules);
    return output;
};

var renderModuleDataOrInformation = function(value, property) {
    var output = '#' + property + '\n';
    if (property.indexOf('modules') === 0) {
        iteration.forEachModule(value, function(moduleId, moduleData) {
            output += moduleId + ':' + moduleData.dependencies.join(',') + '\n';
        });
    }
    else {
        value.forEach(function(valueItem) {
            output += valueItem + '\n';
        });
    }
    return output;
};

var renderAnonymousModules = function(modules) {
    var output = '#anonymous modules\n';
    iteration.forEachModule(modules, function(moduleId, moduleData) {
         if (moduleData.anonymous) {
             output += moduleId + '\n';
         }
    });
    return output;
};

exports.render = render;