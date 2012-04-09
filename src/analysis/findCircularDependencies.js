'use strict';

var forEachDependencyRecursive = require('../iteration/forEachDependencyRecursive.js');

var findCircularDependencies = function(evaluationResult) {
    try {
        forEachDependencyRecursive(evaluationResult.modules, function() {});
    }
    catch (error) {
        evaluationResult.errors.push(error.message);
    }
};

module.exports = findCircularDependencies;