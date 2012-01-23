'use strict';

var errorHandling = require('../common/errorHandling.js');
var vm = require('vm');

var moduleCache, errors, idFromFilename, filename;

var evaluateFiles = function(files) {
    files = files || [];
    resetState();
    var information = [], start = new Date();
    files.forEach(function(file) {
        filename = file.filename;
        idFromFilename = getIdFromFilename(filename);
        errorHandling.executeAndIgnoreErrors(function() {
            vm.runInNewContext(file.contents, { require: requireProxy, define: defineProxy });
        });
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
    return filename.toLowerCase().substring(0, filename.indexOf('js') - 1).replace(/\\/g, '/');
};

var defineProxy = function(explicitId) {
    var moduleData = getModuleData(arguments);
    moduleData.id = moduleData.id.toLowerCase();
    moduleData.dependencies = moduleData.dependencies.map(function(dependency) {
        return dependency.toLowerCase();
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
        return dependency.toLowerCase();
    });
    moduleCache[idFromFilename] = {
        filename: filename,
        dependencies: dependencies
    };
};

exports.evaluateFiles = evaluateFiles;