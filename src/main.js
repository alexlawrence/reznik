'use strict';

var vm = require('./execution/vm.js');
var amdProxy = require('./execution/amdProxy.js');
var filesystem = require('./common/filesystem.js');
var transformation = require('./processing/transformation.js');
var verification = require('./processing/verification.js');
var errorHandling = require('./common/errorHandling.js');

var availableOutputTypes = ['json', 'plain', 'html', 'dot'];

function run(basePath, options) {
    options = options || {};
    options.output = options.output || 'json';
    options.exclude = Array.isArray(options.exclude) ? options.exclude : [options.exclude];
    var filepaths = filesystem.getAllFiles({
        basePath: basePath,
        exclude: options.exclude,
        fileEnding: 'js'
    });
    var files = filesystem.readFiles(basePath, filepaths);
    amdProxy.setExecutionMethod(vm.execute);
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
    if (availableOutputTypes.indexOf(options.output) > -1) {
        var reporter = require('./reporting/' + options.output + 'Reporter.js');
        return reporter.render(evaluationResult);
    }
    return '';

}

exports.run = run;