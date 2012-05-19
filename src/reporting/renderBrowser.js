'use strict';

var template = require('../../node_modules/tmpl/lib/tmpl.js');
var Deferred = require('../../node_modules/Deferred/index.js');

var loadAssets = require('./browser/loadAssets.js');

var inlineScriptTemplate = '<script type="text/javascript">{javascript}</script>';
var inlineCssTemplate = '<style type="text/css">{css}</style>';
var searchInput = '<input type="text" id="search" placeholder="enter module id (or require)" />';
var listItemTemplate = '<li class="{cssClass}">{value}</li>';
var listTemplate = '<ul class="{cssClass}">{items}</ul>';
var scriptTitleTemplate = '<span class="{cssClass}">{value}</span>';
var listTitleTemplate = '<h2 class="{cssClass}">{value}</h2>';

var htmlTemplate = '<!doctype html>' +
    '<html><head><title>script browser</title>{css}</head><body>{header}{content}{javascript}</body></html>';
var headerHtml = '<h1>script browser</h1>';

var renderBrowser = function(evaluationResult) {
    var deferred = new Deferred();
    loadAssets.then(function(assets) {
        var content = '';
        content += searchInput;
        content += renderMessages(evaluationResult.errors, 'errors');
        content += renderScripts(evaluationResult.scripts, 'scripts');
        content += renderScripts(evaluationResult.scriptsFlattened, 'scriptsFlattened');
        content += renderScripts(evaluationResult.scriptsInverted, 'scriptsInverted');
        content += renderMessages(evaluationResult.information, 'information');
        var output = template(htmlTemplate, {
            css: renderCss(assets),
            javascript: renderJavaScript(assets),
            header: headerHtml,
            content: content
        });
        deferred.resolve(output);
    });
    return deferred;
};

var renderMessages = function(messages, title) {
    var output = '';
    if (messages && messages.length > 0) {
        var itemsOutput = '';
        output += template(listTitleTemplate, {cssClass: 'messagesTitle ' + title, value: title});
        messages.forEach(function(message) {
            itemsOutput += template(listItemTemplate, {cssClass: 'message', value: message});
        });
        output += template(listTemplate, {cssClass: 'messages ' + title, items: itemsOutput});
    }
    return output;
};

var renderScripts = function(scripts, title) {
    var output = '';
    if (scripts) {
        output += template(listTitleTemplate, {cssClass: 'scriptsTreeTitle ' + title, value: title});
        scripts.forEach(function(script) {
            var dependenciesOutput = '', scriptOutput = '';
            var displayName = script.type == 'module' ? script.id : 'require()';
            script.dependencies.forEach(function(dependencyId) {
                dependenciesOutput += template(listItemTemplate, {cssClass: 'dependency', value: dependencyId});
            });
            var idElement = template(scriptTitleTemplate, {cssClass: 'scriptId', value: displayName});
            var filenameElement = template(scriptTitleTemplate, {cssClass: 'scriptFilename', value: script.filename});
            scriptOutput += template(scriptTitleTemplate, {cssClass: 'scriptTitle', value: idElement + filenameElement});
            scriptOutput += template(listTemplate, {cssClass: 'dependencies', items: dependenciesOutput});
            var mainCssClass = 'script' + (script.dependencies.length > 0 ? ' withDependencies' : '');
            output += template(listItemTemplate, {cssClass: mainCssClass, value: scriptOutput});
        });
        output = template(listTemplate, {cssClass: 'scriptTree ' + title, items: output});
    }
    return output;
};

var renderJavaScript = function(assets) {
    return template(inlineScriptTemplate, {javascript: assets.jQuery}) +
        template(inlineScriptTemplate, {javascript: assets.search});
};

var renderCss = function(assets) {
    return template(inlineCssTemplate, {css: assets.css});
};

module.exports = renderBrowser;