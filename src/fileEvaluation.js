'use strict';

var amdProxy = require('./amdProxy.js');

var executionMethod = function(basePath, file, context) {
    throw new Error('no execution method set');
};

var setExecutionMethod = function(newExecutionMethod) {
    executionMethod = newExecutionMethod;
};

var evaluateFiles = function(basePath, filenames) {
    filenames = filenames || [];
    amdProxy.reset();
    var information = [], start = new Date();
    var context = {
        define: amdProxy.define, require: amdProxy.require
    };
    filenames.forEach(function(filename) {
        amdProxy.setActiveFilename(filename);
        executionMethod(basePath, filename, context);
    });
    information.push('evaluated ' + filenames.length + ' files');
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