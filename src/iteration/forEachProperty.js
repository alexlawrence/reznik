'use strict';

var forEachProperty = function(object, callback) {
    for (var property in object) {
        if (object.hasOwnProperty(property)) {
            callback(object[property], property, object);
        }
    }
};

module.exports = forEachProperty;