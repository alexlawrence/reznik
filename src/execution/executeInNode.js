'use strict';

var executeAndIgnoreErrors = require('../common/executeAndIgnoreErrors.js');
var vm = require('vm');

var executeInNode = function(script, context) {
    executeAndIgnoreErrors(function() {
        vm.runInNewContext(script, context);
    });
};

module.exports = executeInNode;