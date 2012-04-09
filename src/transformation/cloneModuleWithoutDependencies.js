'use strict';

var cloneModuleWithoutDependencies = function(module) {
    return {
        id: module.id,
        filename: module.filename,
        dependencies: [],
        anonymous: module.anonymous
    }
};

module.exports = cloneModuleWithoutDependencies;