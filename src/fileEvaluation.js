'use strict';

var amdProxy = require('./amdProxy.js');

var executionMethod = function(script, context) {
    throw new Error('no execution method set');
};

var setExecutionMethod = function(newExecutionMethod) {
    executionMethod = newExecutionMethod;
};

var evaluateFiles = function(files) {
    files = files || [];
    amdProxy.reset();
    var information = [], start = new Date();
    files.forEach(function(file) {
        amdProxy.setActiveFilename(file.filename);
        executionMethod(file.contents, {
            define: amdProxy.define, require: amdProxy.require
        });
    });
    information.push('evaluated ' + files.length + ' files');
    information.push('ran for ' + (new Date() - start) + ' ms');
    return {
        modules: amdProxy.getModules(),
        errors: amdProxy.getErrors(),
        configuration: amdProxy.getConfiguration(),
        information: information
    };
};

exports.evaluateFiles = evaluateFiles;
exports.setExecutionMethod = setExecutionMethod;