'use strict';

function executeAndIgnoreErrors(callback) {
    try{
        callback();
    }
    catch (error) {}
}

exports.executeAndIgnoreErrors = executeAndIgnoreErrors;