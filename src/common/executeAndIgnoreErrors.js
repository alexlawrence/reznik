'use strict';

var executeAndIgnoreErrors = function(callback) {
    try{
        callback();
    }
    catch (error) {}
};

module.exports = executeAndIgnoreErrors;