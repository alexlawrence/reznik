'use strict';

var executeAndIgnoreErrors = require('../common/executeAndIgnoreErrors.js');
var filesystem = require('fs');
var temporaryFilename = 'phantom-js.tmp';

var executeInPhantom = function(basePath, filename, context) {
    var page = require('webpage').create();
    var proxyCalls = [];
    page.onConsoleMessage = function(proxyCall) {
        proxyCalls.push(proxyCall);
    };
    createProxiesForPhantom(page, context);
    executeModuleCode(page, basePath + '/' + filename);
    evaluateProxyCalls(proxyCalls, context);
    cleanup();
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
    filesystem.write(temporaryFilename, wrappedScript, 'w');
    page.injectJs(temporaryFilename);
};

var createProxiesForPhantom = function(page, context) {
    page.evaluate(function() {
        window.define = function() {
            console.log('define(' + serializeDefineArguments(arguments) + ')');
        };
        window.require = function(dependencies) {
            if (Array.isArray(dependencies)) {
                console.log('require(' + serializeRequireArguments(dependencies) + ')');
            }
        };
        window.require.config = function(configuration) {
            console.log('require.config(' + JSON.stringify(configuration) + ')');
        };
        var serializeRequireArguments = function(dependencies) {
            return JSON.stringify(dependencies) + ', function() {}';
        };
        var serializeDefineArguments = function(args) {
            var output = '', dependencies;
            if (typeof args[0] === 'string') {
                output += '"' + args[0] + '", ';
                dependencies = args[1];
            }
            else {
                dependencies = args[0];
            }
            if (Array.isArray(dependencies)) {
                output += JSON.stringify(dependencies) + ', ';
            }
            output += 'function() {}';
            return output;
        };
    });
    createAmdDefineProperty(page, context.define.amd);
};

var createAmdDefineProperty = function(page, property) {
    page.evaluate(new Function('window.define.amd = ' + JSON.stringify(property)));
};

var cleanup = function() {
    filesystem.remove(temporaryFilename);
};

module.exports = executeInPhantom;