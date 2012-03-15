'use strict';

var vm = require('vm');
var errorHandling = require('../common/errorHandling.js');

var execute = function(script, context) {
    errorHandling.executeAndIgnoreErrors(function() {
        vm.runInNewContext(script, context);
    });
}

exports.execute = execute;