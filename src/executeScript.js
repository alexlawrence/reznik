'use strict';

var executeAndIgnoreErrors = require('./common/executeAndIgnoreErrors.js');
var vm = require('vm');
var fs = require('fs');

var Deferred = require('Deferred');

var encoding = 'utf-8';

var executeInNode = function(basePath, filename, context) {
    var deferred = new Deferred();
    fs.readFile(basePath + '/' + filename, encoding, function(error, script) {
        executeAndIgnoreErrors(function() {
            vm.runInNewContext(script, context);
        });
        deferred.resolve();
    });
    return deferred;
};

module.exports = executeInNode;