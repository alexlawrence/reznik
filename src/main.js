var amdProxy = require('./amdProxy.js');
var cli = require('./cli.js');
var filesystem = require('./filesystem.js');
var flatten = require('./flatten.js');
var iteration = require('./iteration.js');
var reporter = require('./reporter.js');
var verification = require('./verification.js');
var util = require('./util.js');

function run(basePath, options) {
    var filepaths = filesystem.getAllFiles(basePath);
    var files = filesystem.readFiles(basePath, filepaths);
    var evaluationResult = amdProxy.evaluateFiles(files);
    if (options.verify) {
        verification.executeAllAvailableChecks(evaluationResult);
    }
    if (options.flatten) {
        util.executeAndIgnoreErrors(function() { flatten.flattenDependencies(evaluationResult.modules); });
    }
    return reporter.to(options.output || 'json', evaluationResult);
}

exports.run = run;