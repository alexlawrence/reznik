'use strict';

var renderPlain = require('./renderPlain.js');
var renderBrowser = require('./renderBrowser.js');
var renderJson = require('./renderJson.js');
var renderDot = require('./renderDot.js');

var rendererByOutput = {
    'plain': renderPlain,
    'browser': renderBrowser,
    'json': renderJson,
    'dot': renderDot
};

var getRendererByOutput = function(output) {
    return rendererByOutput[output] || returnOriginalValue;
};

var returnOriginalValue = function(output) {
    return output;
};

exports.getRendererByOutput = getRendererByOutput;