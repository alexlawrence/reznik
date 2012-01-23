'use strict';

var errorHandling = require('../common/errorHandling.js');

var moduleCache, errors, idFromFilename, filename;
var executionMethod = function(script, context) {
    throw new Error('no execution method set');
};

var setExecutionMethod = function(newExecutionMethod) {
    executionMethod = newExecutionMethod;
};

var evaluateFiles = function(files) {
    files = files || [];
    resetState();
    var information = [], start = new Date();
    files.forEach(function(file) {
        filename = file.filename;
        idFromFilename = getIdFromFilename(filename);
        executionMethod(file.contents, {require: requireProxy, define: defineProxy});
    });
    information.push('evaluated ' + files.length + ' files');
    information.push('ran for ' + (new Date() - start) + ' ms');
    return {
        modules: moduleCache,
        errors: errors,
        information: information
    };
};

var resetState = function() {
    moduleCache = {}, errors = [], idFromFilename = '', filename = '';
};

var getIdFromFilename = function(filename) {
    return filename.substring(0, filename.toLowerCase().indexOf('js') - 1).replace(/\\/g, '/');
};

var defineProxy = function(explicitId) {
    var moduleData = getModuleData(arguments);
    moduleData.dependencies = moduleData.dependencies.map(function(dependency) {
        return dependency;
    });
    var matches;
    for (var key in errorChecksForDefine) {
        matches = errorChecksForDefine[key];
        if (errorChecksForDefine.hasOwnProperty(key) && matches(moduleData.id)) {
            return pushError(key, filename);
        }
    }
    moduleCache[moduleData.id] = {
        filename: filename,
        anonymous: moduleData.anonymous,
        dependencies: moduleData.dependencies
    };
};

var getModuleData = function(args) {
    var moduleData = {
        dependencies: []
    };
    if (typeof args[0] === 'string') {
        moduleData.id = args[0];
        moduleData.anonymous = false;
        if (Array.isArray(args[1])) {
            moduleData.dependencies = args[1];
        }
    }
    else {
        moduleData.id = idFromFilename;
        moduleData.anonymous = true;
        if (Array.isArray(args[0])) {
            moduleData.dependencies = args[0];
        }
    }
    return moduleData;
};

var pushError = function(message, filename) {
    errors.push(message + ' in ' + filename);
};

var errorChecksForDefine = {
    'mismatching id and filename': function(id) {
        return id !== idFromFilename;
    },
    'duplicate module definition': function(moduleId) {
        return moduleCache[moduleId] !== undefined;
    }
};

var requireProxy = function(dependencies) {
    if (!Array.isArray(dependencies)) {
        return;
    }
    dependencies = dependencies.map(function(dependency) {
        return dependency;
    });
    moduleCache[idFromFilename] = {
        filename: filename,
        dependencies: dependencies
    };
};

exports.evaluateFiles = evaluateFiles;
exports.setExecutionMethod = setExecutionMethod;