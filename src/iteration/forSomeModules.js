'use strict';

var forSomeModules = function(modules, callback) {
    if (!modules) {
        return;
    }
    var id, shouldAbort;
    for (id in modules) {
        shouldAbort = callback(id, modules[id]);
        if (shouldAbort) {
            return;
        }
    }
};

module.exports = forSomeModules;