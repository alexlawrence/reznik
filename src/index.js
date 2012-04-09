'use strict';

var getCommandLineOptions = require('./common/getCommandLineOptions.js');
var commandLineOptions = getCommandLineOptions();

if (commandLineOptions.help) {
    var cliHelpMessage = '\n' +
        'options:                                       \n' +
        ' -basePath=path                                (base path for AMD modules)\n' +
        ' -flatten=true                                 (default false)\n' +
        ' -invert=true                                  (default false)\n' +
        ' -anaylsis=all,missing,circular,case,paths     (default false)\n' +
        ' -exclude=string1,string2                      (default empty, one or more strings to match)\n' +
        ' -output=json/plain/html/dot                   (default json)\n';

    console.log(cliHelpMessage);
    process.exit();
}

var run = require('./run.js');

if (commandLineOptions.basePath) {
    var evaluationResult = run(commandLineOptions.basePath, commandLineOptions);
    console.log(evaluationResult);
}

exports.run = run;
exports.version = '1.0.0';


