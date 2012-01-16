var isArray = require('util').isArray;

var forEach = function(object, callback) {
    if (isArray(object)) {
        object.forEach(callback);
    }
    for (property in object) {
        if (object.hasOwnProperty(property)) {
            callback(object[property], property, object);
        }
    }
}

exports.forEach = forEach;