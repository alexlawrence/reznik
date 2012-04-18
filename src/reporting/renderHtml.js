'use strict';

var fs = require('fs');
var template = require('../common/template.js');
var forEachModule = require('../iteration/forEachModule.js');
var phantomSafeDirname = __dirname;

var htmlTemplate = '<!doctype html>' +
    '<html><head><title>module browser</title>{styles}</head><body>{header}{search}{output}{scripts}</body></html>';
var headerHtml = '<h1>module browser</h1>';
var searchHtml = '<input type="text" id="search" placeholder="enter module name" />';

var listItemTemplate = '<li class="{cssClass}">{value}</li>';
var listTemplate = '<ul class="{cssClass}">{items}</ul>';
var moduleTitleTemplate = '<span class="{cssClass}">{value}</span>';
var listTitleTemplate = '<h2 class="{cssClass}">{value}</h2>';

var inlineCssTemplate = '<style type="text/css">{style}</style>';
var externalScriptTemplate = '<script type="text/javascript" src="{url}"></script>';
var inlineScriptTemplate = '<script type="text/javascript">{script}</script>';

var jQueryUrl = 'http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';

var renderHtml = function(evaluationResult) {
    var output = '';
    output += renderList(evaluationResult.errors, 'errors');
    output += renderTree(evaluationResult.modules, 'modules');
    output += renderTree(evaluationResult.modulesFlattened, 'modulesFlattened');
    output += renderTree(evaluationResult.modulesInverted, 'modulesInverted');
    output += renderList(evaluationResult.information, 'information');
    output = template(htmlTemplate, {
        styles: renderStyles(),
        header: headerHtml,
        search: searchHtml,
        output: output,
        scripts: renderScripts()
    });
    return output;
};

var renderList = function(messages, title) {
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

var renderTree = function(modules, title) {
    var output = '';
    if (modules) {
        output += template(listTitleTemplate, {cssClass: 'moduleTreeTitle ' + title, value: title});
        forEachModule(modules, function(id, module) {
            var dependenciesOutput = '', moduleOutput = '';
            module.dependencies.forEach(function(dependencyId) {
                dependenciesOutput += template(listItemTemplate, {cssClass: 'dependency', value: dependencyId});
            });
            var idElement = template(moduleTitleTemplate, {cssClass: 'moduleId', value: id});
            var filenameElement = template(moduleTitleTemplate, {cssClass: 'moduleFilename', value: module.filename});
            moduleOutput += template(moduleTitleTemplate, {cssClass: 'moduleTitle', value: idElement + filenameElement});
            moduleOutput += template(listTemplate, {cssClass: 'dependencies', items: dependenciesOutput});
            output += template(listItemTemplate, {cssClass: 'module', value: moduleOutput});
        });
        output = template(listTemplate, {cssClass: 'moduleTree ' + title, items: output});
    }
    return output;
};

var renderScripts = function() {
    var jQueryScript = template(externalScriptTemplate, {url: jQueryUrl});
    var browserScript = fs.readFileSync(phantomSafeDirname + '/assets/browser.js', 'utf-8');
    browserScript = template(inlineScriptTemplate, {script: browserScript});
    return jQueryScript + browserScript;
};

var renderStyles = function() {
    var browserStyle = fs.readFileSync(phantomSafeDirname + '/assets/browser.css', 'utf-8');
    return template(inlineCssTemplate, {style: browserStyle});
};

module.exports = renderHtml;