'use strict';

var getAllFilenames = require('./filesystem/getAllFilenames.js');
var fileEvaluation = require('./fileEvaluation.js');
var analysisRegistry = require('./analysis/analysisRegistry.js');
var flattenModuleList = require('./transformation/flattenModuleList.js');
var invertModuleList = require('./transformation/invertModuleList.js');
var executeAndIgnoreErrors = require('./common/executeAndIgnoreErrors.js');
var reportingRegistry = require('./reporting/reportingRegistry.js');
var executionMethod = require(typeof phantom !== 'undefined' ?
    './execution/executeInPhantom.js' : './execution/executeInNode.js');

var renderMethodByOutputType = {
    'json': 'renderJson', 'plain': 'renderPlain', 'html': 'renderHtml', 'dot': 'renderDot'
};

fileEvaluation.setExecutionMethod(executionMethod);

var run = function(basePath, options) {
    options = completeOptions(options);
    var filenames = getAllJavaScriptFiles(basePath, options);
    var evaluationResult = fileEvaluation.evaluateFiles(basePath, filenames);
    executeAnalysis(evaluationResult, options);
    executeTransformation(evaluationResult, options);
    return render(evaluationResult, options);
};

var completeOptions = function(options) {
    options = options || {};
    options.output = options.output || 'json';
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
    if (renderMethodByOutputType[options.output]) {
        var renderer = reportingRegistry.getRendererByOutput(options.output);
        return renderer(evaluationResult);
    }
    return '';
};

module.exports = run;