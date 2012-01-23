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
        converters.forEach(function(converter){
            if (converter.matches(optionValue)) {
                optionValue = converter.convert(optionValue);
            }
        });
        options[optionName] = optionValue;
    });
    return options;
};

var converters = [
    {
        matches: function(value) { return value.indexOf(arraySeparator) > -1; },
        convert: function(value) { return value.split(arraySeparator); }
    },
    {
        matches: function(value) { return value === 'true' },
        convert: function(value) { return true; }
    },
    {
        matches: function(value) { return value === 'false' },
        convert: function(value) { return false; }
    }
]

exports.initialize = initialize;
exports.argumentsToOptions = argumentsToOptions;