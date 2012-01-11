var util = require('./util.js');
var moduleCache, errors, moduleIdFromFilename, relativeFilename;

var evaluateFiles = function(files) {
    files = files || [];
    resetState();
    files.forEach(function(file) {
        relativeFilename = file.relativeFilename;
        moduleIdFromFilename = getModuleIdFromFilename(relativeFilename);
        util.executeAndIgnoreErrors(function() {
            eval(file.contents);
        });
    });
    return {
        modules: moduleCache,
        errors: errors
    };
};

function resetState() {
    moduleCache = {}, errors = [], moduleIdFromFilename = '', relativeFilename = '';
}

var getModuleIdFromFilename = function(relativeFilename) {
    return relativeFilename.substring(0, relativeFilename.indexOf('js') - 1).replace(/\\/g, '/');
}

var define = function(moduleId, dependencies, factory) {
    var matches;
    for (var key in errorChecksForDefine) {
        matches = errorChecksForDefine[key];
        if (errorChecksForDefine.hasOwnProperty(key) && matches(moduleId)) {
            errors.push(key + ' in ' + relativeFilename);
            return;
        }
    }
    if (typeof dependencies === 'function') {
        factory = dependencies;
        dependencies = [];
    }
    moduleCache[moduleId] = dependencies;
    factory();
};

var errorChecksForDefine = {
    'anonymous module definition': function(moduleId) {
        return typeof moduleId !== 'string';
    },
    'mismatching module id and relative filepath': function(moduleId) {
        return moduleId !== moduleIdFromFilename;
    },
    'duplicate module definition': function(moduleId) {
        return moduleCache[moduleId] !== undefined;
    }
};

var require = function(dependencies, callback) {
    if (moduleCache[moduleIdFromFilename]) {
        moduleCache[moduleIdFromFilename] = moduleCache[moduleIdFromFilename].concat(dependencies);
    }
    else {
        moduleCache[moduleIdFromFilename] = dependencies;
    }
    callback();
};

exports.evaluateFiles = evaluateFiles;