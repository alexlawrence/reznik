var amdProxy = require('./amdProxy.js');
var cli = require('./cli.js');
var filesystem = require('./filesystem.js');
var analysis = require('./analysis.js');

function readAndEvaluateFiles(basePath, relativeFilenames) {
    var files = filesystem.readFiles(basePath, relativeFilenames);
    var result = amdProxy.evaluateFiles(files);
    return result;
}

if (cli.active === true) {
    var result = readAndEvaluateFiles(cli.basePath, cli.relativeFilenames);
    if (cli.analysis) {
        analysis.checkMissingDependencies(result);
    }
    console.log(reporter.toJSON(result));
};

exports.readAndEvaluateFiles = readAndEvaluateFiles;
exports.evaluateFiles = amdProxy.evaluateFiles;

