var amdProxy = require('./amdProxy.js');
var cli = require('./cli.js');
var filesystem = require('./filesystem.js');
var flatten = require('./flatten.js');
var iteration = require('./iteration.js');
var reporter = require('./reporter.js');
var verification = require('./verification.js');

cli.initialize();

if (cli.options.basePath) {
    var files = filesystem.getAllFiles(cli.options.basePath);
    var evaluationResult = readAndEvaluateFiles(cli.options.basePath, files);
    if (cli.options.verify) {
        verification.checkMissingDependencies(evaluationResult);
        verification.checkCircularDependencies(evaluationResult);
    }
    if (cli.options.flatten) {
        if (!cli.options.verify) {
            util.executeAndIgnoreErrors(function() { flatten.flattenDependencies(evaluationResult.modules); });
        }
        else {
            flatten.flattenDependencies(evaluationResult.modules);
        }
    }
    console.log(reporter.to(cli.options.output || 'json', evaluationResult));
}

function readAndEvaluateFiles(basePath, relativeFilenames) {
    var files = filesystem.readFiles(basePath, relativeFilenames);
    var result = amdProxy.evaluateFiles(files);
    return result;
}

exports.evaluateFiles = amdProxy.evaluateFiles;
exports.filesystem = filesystem;
exports.flattenDependencies = flatten.flattenDependencies;
exports.readAndEvaluateFiles = readAndEvaluateFiles;
exports.reporter = reporter;
exports.verification = verification;

