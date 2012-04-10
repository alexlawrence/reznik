'use strict';

var findMissingDependencies = require('./findMissingDependencies.js');
var findCircularDependencies = require('./findCircularDependencies.js');
var findCaseMismatches = require('./findCaseMismatches.js');
var findAbsoluteIdsWithoutConfig = require('./findAbsoluteIdsWithoutPaths.js');

var analysisByName = {
    'missing': findMissingDependencies,
    'circular': findCircularDependencies,
    'case': findCaseMismatches,
    'paths': findAbsoluteIdsWithoutConfig
};

var getAnalysisByName = function(name) {
    return analysisByName[name] || function() {};
};

var executeEveryAnalysis = function(evaulationResult) {
    for (var name in analysisByName) {
        if (analysisByName.hasOwnProperty(name)) {
            analysisByName[name](evaulationResult);
        }
    }
};

exports.getAnalysisByName = getAnalysisByName;
exports.executeEveryAnalysis = executeEveryAnalysis;