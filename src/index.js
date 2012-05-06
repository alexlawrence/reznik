'use strict';

var getCommandLineOptions = require('./common/getCommandLineOptions.js');
var commandLineOptions = getCommandLineOptions();

if (commandLineOptions.help) {
    var cliHelpMessage = '\n' +
        'options:                                       \n' +
        ' -basePath=path                                (base path for AMD modules)\n' +
        ' -flatten=true                                 (default empty)\n' +
        ' -invert=true                                  (default empty)\n' +
        ' -analysis=all,missing,circular,case,paths     (default empty)\n' +
        ' -exclude=string1,string2                      (default empty, list of strings to match)\n' +
        ' -output=json/plain/html/dot                   (default json)\n';

    console.log(cliHelpMessage);
    process.exit();
}

var run = require('./run.js');

if (commandLineOptions.basePath) {
    commandLineOptions.output = commandLineOptions.output || 'json';
    var evaluationResult = run(commandLineOptions);
    console.log(evaluationResult);
}

exports.run = run;
exports.version = '1.0.8';


