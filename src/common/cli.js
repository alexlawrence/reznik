var argumentPrefix = '-', separator = '=', arraySeparator = ',';

var initialize = function(setup) {
    var args = process.argv.splice(2);
    var options = argumentsToOptions(args);
    if (options.help) {
        console.log(setup.helpMessage || 'no help available');
        process.exit();
    }
    exports.options = options;
}

var argumentsToOptions = function(args) {
    var options = {};
    args.forEach(function(argument) {
        if (argument.indexOf(argumentPrefix) !== 0) {
            return;
        }
        var separatorIndex = argument.indexOf(separator);
        if (separatorIndex == -1) {
            separatorIndex = argument.length;
        }
        var optionName = argument.substring(argumentPrefix.length, separatorIndex);
        var optionValue = argument.substring(separatorIndex + 1) || 'true';

        if (optionValue.indexOf(arraySeparator) > -1) {
            optionValue = optionValue.split(arraySeparator);
        }

        options[optionName] = optionValue;
    });
    return options;
};

exports.initialize = initialize;
exports.argumentsToOptions = argumentsToOptions;