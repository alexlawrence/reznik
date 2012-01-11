var cli = require('./cli.js');
var main = require('./main.js');

cli.initialize();
if (cli.options.basePath) {
    var result = main.run(cli.options.basePath, cli.options);
    console.log(result);
}

exports.run = main.run;

