'use strict';

var forEachProperty = require('../iteration/forEachProperty.js');

var placeholderPrefix = '{', placeholderSuffix = '}';

var template = function(template, data) {
    var output = template, placeholder, dataClone = {};
    forEachProperty(data, function(value, property) {
        dataClone[property] = value;
    });
    dataClone[placeholderPrefix] = placeholderPrefix;
    dataClone[placeholderSuffix] = placeholderSuffix;
    forEachProperty(dataClone, function(value, property) {
        placeholder = new RegExp(placeholderPrefix + property + placeholderSuffix, 'g');
        output = output.replace(placeholder, value);
    });
    return output;
};

module.exports = template;