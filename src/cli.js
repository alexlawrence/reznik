var optimist = require('optimist');

var options = optimist
    .usage('Usage: $0 -b [string]')
    .options('b', {
        describe: 'base path of JavaScript files',
        demand: true,
        alias: 'basePath',
        string: true
    })
    .options('f', {
        describe: 'includes a flattened list of scripts',
        alias: 'flatten'
    })
    .options('i', {
        describe: 'includes an inverted list of scripts',
        alias: 'invert'
    })
    .options('a', {
        describe: 'list of analysis to execute (all/missing/circular/cases/paths/duplicates)',
        alias: 'analysis',
        string: true
    })
    .options('e', {
        describe: 'string patterns of files/paths to exclude',
        alias: 'exclude',
        string: true
    })
    .options('o', {
        describe: 'output format (json/plain/browser/dot)',
        alias: 'output',
        default: 'json'
    })
    .argv;

if (options.basePath) {
    options.analysis = options.analysis ? options.analysis.split(',') : [];
    options.exclude = options.exclude ? options.exclude.split(',') : [];
}

module.exports = options;