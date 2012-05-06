(function() {

    'use strict';

    window.define = function() {
        console.log('define(' + serializeArguments(arguments) + ');');
    };

    window.require = function() {
        console.log('require(' + serializeArguments(arguments) + ');');
    };

    window.require.config = function(configuration) {
        console.log('require.config(' + JSON.stringify(configuration) + ');');
    };

    var serializeArguments = function(args) {
        var preparedArgs = Array.prototype.map.call(args, function(arg) {
            return typeof arg === 'function' ? arg.toString() : JSON.stringify(arg);
        });
        return preparedArgs.join(',');
    };

}());