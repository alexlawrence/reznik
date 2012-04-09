'use strict';

var argumentPrefix = '-', separator = '=', arraySeparator = ',';

var getCommandLineOptions = function() {
    var args = process.argv.splice(2);
    return argumentsToOptions(args);
};

var argumentsToOptions = function(args) {
    var options = {};
    args.forEach(function(argument) {
        if (argument.indexOf(argumentPrefix) !== 0) {
            return;
        }
        var separatorIndex = getSeparatorIndex(argument);
        var optionName = argument.substring(argumentPrefix.length, separatorIndex);
        var optionValue = argument.substring(separatorIndex + 1) || 'true';
        valueConverters.forEach(function(valueConverter){
            if (valueConverter.matches(optionValue)) {
                optionValue = valueConverter.convert(optionValue);
            }
        });
        options[optionName] = optionValue;
    });
    return options;
};

var getSeparatorIndex = function(argument) {
    var separatorIndex = argument.indexOf(separator);
    if (separatorIndex == -1) {
        separatorIndex = argument.length;
    }
    return separatorIndex;
};

var valueConverters = [
    {
        matches: function(value) { return value.indexOf(arraySeparator) > -1; },
        convert: function(value) { return value.split(arraySeparator); }
    },
    {
        matches: function(value) { return value === 'true' },
        convert: function() { return true; }
    },
    {
        matches: function(value) { return value === 'false' },
        convert: function() { return false; }
    }
];

module.exports = getCommandLineOptions;