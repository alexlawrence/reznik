'use strict';

var waitForDeferred = function(deferred) {
    return {
        then: function(callback) {
            var resolved = false, args;
            deferred.then(function() {
                args = arguments;
                resolved = true;
            });
            waitsFor(function() {
                return resolved;
            });
            runs(function() {
                callback.apply(this, args);
            });
        }
    };
};

module.exports = waitForDeferred;