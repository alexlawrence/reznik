'use strict';

var executeAndIgnoreErrors = require('../common/executeAndIgnoreErrors.js');
var filesystem = require('fs');
var temporaryFile = 'phantom-js.tmp';
var phantomContext = __dirname + '/phantomContext.js';

var executeInPhantom = function(basePath, filename, context) {
    var page = require('webpage').create();
    var proxyCalls = [];
    page.onConsoleMessage = function(proxyCall) {
        proxyCalls.push(proxyCall);
    };
    createProxies(page, context);
    executeModuleCode(page, basePath + '/' + filename);
    evaluateProxyCalls(proxyCalls, context);
    cleanup();
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
    var script = filesystem.read(absoluteFilename);
    var wrappedScript = 'try{\n' + script + '\n} catch(e) {}';
    filesystem.write(temporaryFile, wrappedScript, 'w');
    page.injectJs(temporaryFile);
};

var cleanup = function() {
    filesystem.remove(temporaryFile);
};

module.exports = executeInPhantom;