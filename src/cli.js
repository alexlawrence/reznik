var initialize = function() {
    var args = process.argv.splice(2);
    var options = argumentsToOptions(args);

    if (options.help) {
        console.log('\n' +
            'options:                   \n' +
            ' -basePath=path            (base path for AMD modules)\n' +
            ' -flatten=true/false       (default false)\n' +
            ' -verify=true/false        (default false)\n' +
            ' -output=json/xml/plain    (default json)\n');
        process.exit();
    }

    exports.options = options;
}

var argumentsToOptions = function(args) {
    var options = {};
    args.forEach(function(argument) {
        if (argument.indexOf('-') !== 0) {
            return;
        }
        var separatorIndex = argument.indexOf('=');
        if (separatorIndex == -1) {
            separatorIndex = argument.length;
        }
        var optionName = argument.substring(1, separatorIndex);
        var optionValue = argument.substring(separatorIndex + 1) || 'true';
        options[optionName] = optionValue;
    });
    return options;
};

exports.initialize = initialize;
exports.argumentsToOptions = argumentsToOptions;