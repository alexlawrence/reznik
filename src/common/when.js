'use strict';

var Deferred = require('./Deferred.js');

var when = function(deferreds) {
    var whenDeferred = new Deferred(), unresolved, deferredsArguments = [];

    if (!deferreds || deferreds.length === 0) {
        whenDeferred.resolve();
        return whenDeferred;
    }

    deferreds = Array.isArray(deferreds) ? deferreds : (arguments.length > 1 ? convertToArray(arguments) : [deferreds]);
    unresolved = deferreds.length;

    deferreds.forEach(function(deferred, index) {
        if (!(deferred instanceof Deferred)) {
            deferred = wrapValueAsDeferred(deferred);
        }
        deferred.then(function() {
            deferredsArguments[index] = arguments;
            unresolved -= 1;
            if (unresolved <= 0) {
                whenDeferred.resolve.apply(whenDeferred, deferredsArguments);
            }
        });
    });

    return whenDeferred;
};

var convertToArray = function(value) {
    return Array.prototype.slice.call(value);
};

var wrapValueAsDeferred = function(value) {
    var deferred = new Deferred();
    deferred.resolve(value);
    return deferred;
};

module.exports = when;