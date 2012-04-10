'use strict';

var forSomeModules = require('./forSomeModules.js');

var forEachModule = function(modules, callback) {
    var wrappedCallback = function(id, module) {
        callback(id, module);
        return false;
    };
    forSomeModules(modules, wrappedCallback);
};

module.exports = forEachModule;