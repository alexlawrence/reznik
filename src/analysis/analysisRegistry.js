'use strict';

var findMissingDependencies = require('./findMissingDependencies.js');
var findCircularDependencies = require('./findCircularDependencies.js');
var findCaseMismatches = require('./findCaseMismatches.js');
var findAbsoluteIdsWithoutConfig = require('./findAbsoluteIdsWithoutPaths.js');
var findDuplicateIds = require('./findDuplicateIds.js');

var analysisByName = {
    'missing': findMissingDependencies,
    'circular': findCircularDependencies,
    'cases': findCaseMismatches,
    'paths': findAbsoluteIdsWithoutConfig,
    'duplicates': findDuplicateIds
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