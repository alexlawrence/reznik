'use strict';

var executeAndIgnoreErrors = require('../common/executeAndIgnoreErrors.js');

var executeInPhantom = function(script, context) {
    var page = require('webpage').create();
    var proxyCalls = [];
    page.onConsoleMessage = function(proxyCall) {
        proxyCalls.push(proxyCall);
    };
    createProxiesForPhantom(page, context);
    executeModuleCode(page, script);
    evaluateProxyCalls(proxyCalls, context);
};

var evaluateProxyCalls = function(proxyCalls, context) {
    executeAndIgnoreErrors(function() {
        proxyCalls.forEach(function(proxyCall) {
            eval('context.' + proxyCall);
        });
    });
};

var executeModuleCode = function(page, script) {
    page.evaluate(new Function('try{' + script + '} catch(e) {}'));
};

var createProxiesForPhantom = function(page, context) {
    page.evaluate(function() {
        window.define = function() {
            console.log('define(' + convertToEvaluableString(arguments) + ')');
        };
        window.require = function() {
            console.log('require(' + convertToEvaluableString(arguments) + ')');
        };
        window.require.config = function(configuration) {
            console.log('require.config(' + JSON.stringify(configuration) + ')');
        };
        var convertToEvaluableString = function(args) {
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

module.exports = executeInPhantom;