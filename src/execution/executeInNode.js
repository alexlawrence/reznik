'use strict';

var executeAndIgnoreErrors = require('../common/executeAndIgnoreErrors.js');
var vm = require('vm');
var fs = require('fs');

var encoding = 'utf-8';

var executeInNode = function(basePath, filename, context) {
    var script = fs.readFileSync(basePath + '/' + filename, encoding);
    executeAndIgnoreErrors(function() {
        vm.runInNewContext(script, context);
    });
};

module.exports = executeInNode;