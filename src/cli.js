var initialize = function() {
    var args = process.argv.splice(2);
    var options = argumentsToOptions(args);

    if (options.help) {
        console.log('options: -basePath=path ' +
            '-flatten=true/false (default: false) -verify=true/false (default: false) ' +
            '-output=json/xml/plain (default: json)');
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