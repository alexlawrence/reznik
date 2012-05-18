'use strict';

var webpage = require('webpage');
var filesystem = require('fs');

var Deferred = require('../common/Deferred.js');
var executeAndIgnoreErrors = require('../common/executeAndIgnoreErrors.js');

var phantomContext = __dirname + '/phantomContext.js';

var absoluteWindowsPath = /^\w*:[\/|\\]/;

var executeInPhantom = function(basePath, filename, context) {
    var page = webpage.create();
    var proxyCalls = setupProxyCalls(page);
    createProxies(page, context);
    var deferred = new Deferred();
    executeModuleCode(page, basePath + '/' + filename).then(function() {
        evaluateProxyCalls(proxyCalls, context);
        deferred.resolve();
    });
    return deferred;
};

var setupProxyCalls = function(page) {
    var proxyCalls = [];
    page.onConsoleMessage = function (proxyCall) {
        proxyCalls.push(proxyCall);
    };
    return proxyCalls;
};

var createProxies = function(page, context) {
    page.injectJs(phantomContext);
    var json = JSON.stringify(context.define.amd);
    page.evaluate(new Function('window.define.amd = ' + json));
};

var evaluateProxyCalls = function(proxyCalls, context) {
    executeAndIgnoreErrors(function() {
        proxyCalls.forEach(function(proxyCall) {
            eval('context.' + proxyCall);
        });
    });
};

var executeModuleCode = function(page, absoluteFilename) {
    var deferred = new Deferred();
    if (!isAbsolutePath(absoluteFilename)) {
        absoluteFilename = filesystem.workingDirectory + '/' + absoluteFilename;
    }
    absoluteFilename = absoluteFilename.replace(/\\/g, '/');
    page.includeJs(absoluteFilename, function() { deferred.resolve(); });
    return deferred;
};

var isAbsolutePath = function(path) {
    return path.indexOf('/') == 0 || absoluteWindowsPath.test(path);
};

module.exports = executeInPhantom;