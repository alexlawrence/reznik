'use strict';

var getAllFilenames = require('./filesystem/getAllFilenames.js');
var fileEvaluation = require('./fileEvaluation.js');
var analysisRegistry = require('./analysis/analysisRegistry.js');
var flattenModuleList = require('./transformation/flattenScriptsList.js');
var invertModuleList = require('./transformation/invertScriptsList.js');
var executeAndIgnoreErrors = require('./common/executeAndIgnoreErrors.js');
var reportingRegistry = require('./reporting/reportingRegistry.js');
var executionMethod = require(typeof phantom !== 'undefined' ?
    './execution/executeInPhantom.js' : './execution/executeInNode.js');
var Deferred = require('./common/Deferred.js');
var when = require('./common/when.js');

fileEvaluation.setExecutionMethod(executionMethod);

var run = function(options) {
    options = completeOptions(options);
    var deferred = new Deferred();
    getAllJavaScriptFiles(options.basePath, options).then(function(filenames) {
        fileEvaluation.evaluateFiles(options.basePath, filenames)
            .then(function(evaluationResult) {
                executeAnalysis(evaluationResult, options);
                executeTransformation(evaluationResult, options);
                when(render(evaluationResult, options)).then(function(results) {
                    deferred.resolve(results[0]);
                });
            }
        );
    });
    return deferred;
};

var completeOptions = function(options) {
    options = options || {};
    options.exclude = Array.isArray(options.exclude) ? options.exclude : [options.exclude];
    return options;
};

var getAllJavaScriptFiles = function(basePath, options) {
    return getAllFilenames({
        basePath: basePath,
        exclude: options.exclude,
        fileEnding: 'js'
    });
};

var executeAnalysis = function(evaluationResult, options) {
    if (options.analysis == 'all') {
        analysisRegistry.executeEveryAnalysis(evaluationResult);
    }
    else {
        var names = Array.isArray(options.analysis) ? options.analysis : [options.analysis];
        names.forEach(function(name) {
            analysisRegistry.getAnalysisByName(name)(evaluationResult);
        });
    }
};

var executeTransformation = function(evaluationResult, options) {
    if (options.flatten) {
        executeAndIgnoreErrors(function() {
            evaluationResult.modulesFlattened = flattenModuleList(evaluationResult.modules);
        });
    }
    if (options.invert) {
        evaluationResult.modulesInverted = invertModuleList(evaluationResult.modules);
    }
};

var render = function(evaluationResult, options) {
    var renderer = reportingRegistry.getRendererByOutput(options.output);
    return renderer(evaluationResult);
};

module.exports = run;