'use strict';

var getCommandLineOptions = require('./common/getCommandLineOptions.js');
var Deferred = require('./common/Deferred.js');

var run = require('./run.js');

var commandLineOptions = getCommandLineOptions();

if (commandLineOptions.help) {
    var cliHelpMessage = '\n' +
        'options:\n' +
        ' -basePath=path\n' +
        ' -flatten=true                                             (default empty)\n' +
        ' -invert=true                                              (default empty)\n' +
        ' -analysis=all,missing,circular,cases,paths,duplicates     (default empty)\n' +
        ' -exclude=string1,string2                                  (default empty)\n' +
        ' -output=json/plain/browser/dot                            (default json)\n';

    console.log(cliHelpMessage);
    process.exit();
}

if (commandLineOptions.basePath) {
    commandLineOptions.output = commandLineOptions.output || 'json';
    var evaluation = run(commandLineOptions);
    var deferred = new Deferred();
    evaluation.then(function(evaluationResult) {
        console.log(evaluationResult);
        deferred.resolve();
    });
    module.exports = deferred;
}

module.exports.run = run;
module.exports.version = '1.2.5';


