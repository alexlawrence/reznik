var amdProxy = require('./processing/amdProxy.js');
var filesystem = require('./common/filesystem.js');
var transformation = require('./processing/transformation.js');
var reporter = require('./processing/reporter.js');
var verification = require('./processing/verification.js');
var errorHandling = require('./common/errorHandling.js');

function run(basePath, options) {
    var filepaths = filesystem.getAllFiles(basePath);
    var files = filesystem.readFiles(basePath, filepaths);
    var evaluationResult = amdProxy.evaluateFiles(files);
    if (options.verify) {
        verification.executeAllAvailableChecks(evaluationResult);
    }
    if (options.flattened) {
        errorHandling.executeAndIgnoreErrors(function() {
            evaluationResult.modulesFlattened = transformation.generateFlattenedModuleList(evaluationResult.modules);
        });
    }
    if (options.inverted) {
        evaluationResult.modulesInverted = transformation.generateInvertedModuleList(evaluationResult.modules);

    }
    return reporter.to(options.output || 'json', evaluationResult);
}

exports.run = run;