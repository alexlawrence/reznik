'use strict';

var fs = require('fs');
var template = require('../common/template.js');

var forEachModule = require('../iteration/forEachModule.js');

var inlineScriptTemplate = '<script type="text/javascript">{script}</script>';
var inlineCssTemplate = '<style type="text/css">{style}</style>';
var searchInput = '<input type="text" id="search" placeholder="enter module name" />';
var listItemTemplate = '<li class="{cssClass}">{value}</li>';
var listTemplate = '<ul class="{cssClass}">{items}</ul>';
var moduleTitleTemplate = '<span class="{cssClass}">{value}</span>';
var listTitleTemplate = '<h2 class="{cssClass}">{value}</h2>';

var assetsPath = __dirname + '/assets/';

var htmlTemplate = '<!doctype html>' +
    '<html><head><title>module browser</title>{styles}</head><body>{header}{content}{scripts}</body></html>';
var headerHtml = '<h1>module browser</h1>';

var renderBrowser = function(evaluationResult) {
    var content = '';
    content += searchInput;
    content += renderMessages(evaluationResult.errors, 'errors');
    content += renderModules(evaluationResult.modules, 'modules');
    content += renderModules(evaluationResult.modulesFlattened, 'modulesFlattened');
    content += renderModules(evaluationResult.modulesInverted, 'modulesInverted');
    content += renderMessages(evaluationResult.information, 'information');
    return template(htmlTemplate, {
        styles: renderStyle(),
        scripts: renderScripts(),
        header: headerHtml,
        content: content
    });
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

var renderModules = function(modules, title) {
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
            var mainCssClass = 'module' + (module.dependencies.length > 0 ? ' withDependencies' : '');
            output += template(listItemTemplate, {cssClass: mainCssClass, value: moduleOutput});
        });
        output = template(listTemplate, {cssClass: 'moduleTree ' + title, items: output});
    }
    return output;
};


var renderScripts = function() {
    var jQuery = fs.readFileSync(assetsPath + 'jquery-1.7.1.min.js', 'utf-8');
    var search = fs.readFileSync(assetsPath + 'search.js', 'utf-8');
    return template(inlineScriptTemplate, {script: jQuery}) +
        template(inlineScriptTemplate, {script: search});
};

var renderStyle = function() {
    var style = fs.readFileSync(assetsPath + 'browser.css', 'utf-8');
    return template(inlineCssTemplate, {style: style});
};

module.exports = renderBrowser;