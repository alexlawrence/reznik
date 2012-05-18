'use strict';

var forEachModule = function(scripts, callback) {
    var modules = (scripts || []).filter(function(script) { return script.type == 'module'; });
    return modules.forEach(callback || function() {});
};

module.exports = forEachModule;