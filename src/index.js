'use strict';

var Deferred = require('Deferred');
var when = Deferred.when;
var getAllFilenames = require('./filesystem/getAllFilenames.js');
var fileEvaluation = require('./fileEvaluation.js');
var analysisRegistry = require('./analysis/analysisRegistry.js');
var flattenScriptsList = require('./transformation/flattenScriptsList.js');
var invertScriptsList = require('./transformation/invertScriptsList.js');
var executeAndIgnoreErrors = require('./common/executeAndIgnoreErrors.js');
var reportingRegistry = require('./reporting/reportingRegistry.js');
var executionMethod = require('./executeScript.js');

fileEvaluation.setExecutionMethod(executionMethod);

var run = function(options) {
    options = completeOptions(options);
    var deferred = new Deferred();
    getAllJavaScriptFiles(options.basePath, options).then(function(filenames) {
        fileEvaluation.evaluateFiles(options.basePath, filenames)
            .then(function(evaluationResult) {
                executeAnalysis(evaluationResult, options);
                executeTransformation(evaluationResult, options);
                when(render(evaluationResult, options)).then(function(rendered) {
                    deferred.resolve(rendered);
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
    if (options.analysis === 'all') {
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
            evaluationResult.scriptsFlattened = flattenScriptsList(evaluationResult.scripts);
        });
    }
    if (options.invert) {
        evaluationResult.scriptsInverted = invertScriptsList(evaluationResult.scripts);
    }
};

var render = function(evaluationResult, options) {
    var renderer = reportingRegistry.getRendererByOutput(options.output);
    return renderer(evaluationResult);
};

if (require.main == module) {
    var options = require('./cli.js');
    run(options).then(function(result) {console.log(result); });
}

module.exports.run = run;
module.exports.version = '1.3.0';

