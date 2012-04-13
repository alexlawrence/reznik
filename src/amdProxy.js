'use strict';

var getIdFromFilename = require('./common/getModuleIdFromFilename.js');
var extendObject = require('./common/extendObject.js');

var modules = {}, errors = [], idFromFilename = '', filename = '', configuration = {};

var defineProxy = function() {
    var module = {};
    module.filename = filename;
    module.anonymous = typeof arguments[0] !== 'string';
    module.id = module.anonymous ? idFromFilename : arguments[0];
    var dependenciesCandidate = module.anonymous ? arguments[0] : arguments[1];
    module.dependencies = Array.isArray(dependenciesCandidate) ? dependenciesCandidate.slice(0) : [];

    if (modules[module.id] !== undefined) {
        return errors.push('duplicate module definition in ' + module.filename);
    }
    modules[module.id] = module;
};

defineProxy.amd = {};

var requireProxy = function(dependencies) {
    if (!Array.isArray(dependencies)) {
        return;
    }
    dependencies = dependencies.slice(0);
    modules[idFromFilename] = {
        id: idFromFilename,
        filename: filename,
        dependencies: dependencies
    };
};

requireProxy.config = function(newConfiguration) {
    extendObject(configuration, newConfiguration);
};

var setActiveFilename = function(newFilename) {
    filename = newFilename;
    idFromFilename = getIdFromFilename(filename);
};

var reset = function() {
    modules = {};
    configuration = {};
    errors = [];
    idFromFilename = filename = '';
};

var getModules = function() {
    return modules;
};

var getErrors = function() {
    return errors;
};

var getConfiguration = function() {
    return configuration;
};

exports.reset = reset;
exports.setActiveFilename = setActiveFilename;
exports.define = defineProxy;
exports.require = requireProxy;
exports.getModules = getModules;
exports.getErrors = getErrors;
exports.getConfiguration = getConfiguration;