'use strict';

var extend = require('node.extend');
var getIdFromFilename = require('./common/getModuleIdFromFilename.js');

var scripts = [], errors = [], idFromFilename = '', filename = '', configuration = {};

var defineProxy = function() {
    var module = {type: 'module'};
    module.filename = filename;
    module.anonymous = typeof arguments[0] !== 'string';
    module.id = module.anonymous ? idFromFilename : arguments[0];
    var dependenciesCandidate = module.anonymous ? arguments[0] : arguments[1];
    var isArray = Array.isArray(dependenciesCandidate);
    module.dependencies = isArray ? dependenciesCandidate.slice(0) : [];
    var indexOfFactory = (module.anonymous ? 0 : 1) + (isArray ? 1 : 0);
    module.factory = arguments[indexOfFactory];
    scripts.push(module);
};

defineProxy.amd = {};

var requireProxy = function(dependencies, factory) {
    if (!Array.isArray(dependencies)) {
        return;
    }
    dependencies = dependencies.slice(0);
    scripts.push({
        filename: filename,
        dependencies: dependencies,
        factory: factory,
        type: 'require'
    });
};

requireProxy.config = function(newConfiguration) {
    extend(true, configuration, newConfiguration);
};

var setActiveFilename = function(newFilename) {
    filename = newFilename;
    idFromFilename = getIdFromFilename(filename);
};

var reset = function() {
    scripts = [];
    configuration = {};
    errors = [];
    idFromFilename = filename = '';
};

var getScripts = function() {
    return scripts;
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
exports.getScripts = getScripts;
exports.getErrors = getErrors;
exports.getConfiguration = getConfiguration;