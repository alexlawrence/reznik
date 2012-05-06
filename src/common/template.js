'use strict';

var forEachProperty = require('../iteration/forEachProperty.js');

var regex = /{([^}]*)}/g;

var template = function(template, data) {
    var output = template, placeholder, dataClone = {};
    forEachProperty(data, function(value, property) {
        dataClone[property] = value;
    });
    output = output.replace(regex, function(match, property) {
        return dataClone.hasOwnProperty(property) ? dataClone[property] : match;
    });
    return output;
};

module.exports = template;