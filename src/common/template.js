'use strict';

var forEach = require('./objectForEach.js').forEach;

var placeholderPrefix = '{', placeholderSuffix = '}';

var template = function(template, data) {
    var output = template, placeholder, dataClone = {};
    forEach(data, function(value, property) {
        dataClone[property] = value;
    });
    dataClone[placeholderPrefix] = placeholderPrefix;
    dataClone[placeholderSuffix] = placeholderSuffix;
    forEach(dataClone, function(value, property) {
        placeholder = placeholderPrefix + property + placeholderSuffix;
        output = output.replace(placeholder, value);
    });
    return output;
};

exports.template = template;