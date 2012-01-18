'use strict';

var cli = require('./common/cli.js');
var main = require('./processing/main.js');

var cliHelpMessage = '\n' +
    'options:                                \n' +
    ' -basePath=path                        (base path for AMD modules)\n' +
    ' -flattened=true/false                 (default false)\n' +
    ' -inverted=true/false                  (default false)\n' +
    ' -verify=true/false                    (default false)\n' +
    ' -exclude=string1,string2              (default empty, one or more strings to match)\n' +
    ' -output=json/plain/html               (default json)\n';

cli.initialize({helpMessage: cliHelpMessage});
if (cli.options.basePath) {
    var evaluationResult = main.run(cli.options.basePath, cli.options);
    console.log(evaluationResult);
}

exports.run = main.run;

