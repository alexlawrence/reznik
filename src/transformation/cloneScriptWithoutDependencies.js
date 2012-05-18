'use strict';

var cloneScriptWithoutDependencies = function(script) {
    return {
        id: script.id,
        filename: script.filename,
        dependencies: [],
        anonymous: script.anonymous,
        type: script.type
    }
};

module.exports = cloneScriptWithoutDependencies;