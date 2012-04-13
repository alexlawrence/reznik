(function() {

    'use strict';

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

}());