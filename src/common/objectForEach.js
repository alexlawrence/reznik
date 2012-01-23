'use strict';

var forEach = function(object, callback) {
    if (Array.isArray(object)) {
        return object.forEach(callback);
    }
    for (var property in object) {
        if (object.hasOwnProperty(property)) {
            callback(object[property], property, object);
        }
    }
};

exports.forEach = forEach;