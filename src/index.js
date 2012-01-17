var cli = require('./common/cli.js');
var main = require('./main.js');

var cliHelpMessage = '\n' +
    'options:                                            \n' +
    ' -basePath=path                        (base path for AMD modules)\n' +
    ' -flattened=true/false                 (default false)\n' +
    ' -inverted=true/false                  (default false)\n' +
    ' -verify=true/false                    (default false)\n' +
    ' -exclude=[string1],[string2]          (default empty, one or more strings to match)\n' +
    ' -output=json/plain                    (default json)\n';

cli.initialize({helpMessage: cliHelpMessage});
if (cli.options.basePath) {
    var result = main.run(cli.options.basePath, cli.options);
    console.log(result);
}

exports.run = main.run;

