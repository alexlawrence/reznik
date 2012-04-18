'use strict';

var renderPlain = require('./renderPlain.js');
var renderHtml = require('./renderHtml.js');
var renderJson = require('./renderJson.js');
var renderDot = require('./renderDot.js');

var rendererByOutput = {
    'plain': renderPlain,
    'html': renderHtml,
    'json': renderJson,
    'dot': renderDot
};

var getRendererByOutput = function(output) {
    return rendererByOutput[output] || renderJson;
};

exports.getRendererByOutput = getRendererByOutput;