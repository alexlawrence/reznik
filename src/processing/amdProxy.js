var errorHandling = require('../common/errorHandling.js');
var isArray = require('util').isArray;
var vm = require('vm');

var moduleCache, errors, moduleIdFromFilename, relativeFilename;

var evaluateFiles = function(files) {
    files = files || [];
    resetState();
    var information = [], start = new Date();
    files.forEach(function(file) {
        relativeFilename = file.relativeFilename;
        moduleIdFromFilename = getModuleIdFromFilename(relativeFilename);
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
    moduleCache = {}, errors = [], moduleIdFromFilename = '', relativeFilename = '';
};

var getModuleIdFromFilename = function(relativeFilename) {
    return relativeFilename.substring(0, relativeFilename.indexOf('js') - 1).replace(/\\/g, '/').toLowerCase();
};

var defineProxy = function(moduleId, dependencies, factory) {
    if (typeof moduleId !== 'string') {
        return pushError('anonymous module definition', relativeFilename);
    }
    moduleId = moduleId.toLowerCase();
    var matches;
    for (var key in errorChecksForDefine) {
        matches = errorChecksForDefine[key];
        if (errorChecksForDefine.hasOwnProperty(key) && matches(moduleId)) {
            return pushError(key, relativeFilename);
        }
    }
    if (typeof dependencies === 'function') {
        dependencies = [];
    }
    else {
        dependencies = dependencies.map(function(dependency) {
            return dependency.toLowerCase();
        });
    }
    moduleCache[moduleId] = dependencies;
};

var pushError =function(message, filename) {
    errors.push(message + ' in ' + filename);
};

var errorChecksForDefine = {
    'mismatching module id and relative filepath': function(moduleId) {
        return moduleId !== moduleIdFromFilename;
    },
    'duplicate module definition': function(moduleId) {
        return moduleCache[moduleId] !== undefined;
    }
};

var requireProxy = function(dependencies) {
    if (!isArray(dependencies)) {
        return;
    }
    dependencies = dependencies.map(function(dependency) {
        return dependency.toLowerCase();
    });
    moduleCache[moduleIdFromFilename] = (moduleCache[moduleIdFromFilename] || []).concat(dependencies);
};

exports.evaluateFiles = evaluateFiles;