var fs = require('fs');
var template = require('../common/template.js').template;
var iteration = require('../processing/iteration.js');

var htmlTemplate = '<!doctype html><html><head><title>module browser</title>{styles}</head><body>{header}{search}{output}{scripts}</body></html>';
var headerHtml = '<h1>module browser</h1>';
var searchHtml = '<input type="text" id="search" placeholder="enter module name" />';

var listItemTemplate = '<li class="{title}">{value}</li>';
var listTemplate = '<ul class="{title}">{items}</ul>';
var moduleTitleTemplate = '<span class="{title}">{value}</span>';
var listTitleTemplate = '<h2 class="{title}">{value}</h2>';

var inlineCssTemplate = '<style type="text/css">{style}</style>';
var externalScriptTemplate = '<script type="text/javascript" src="{url}"></script>';
var inlineScriptTemplate = '<script type="text/javascript">{script}</script>';

var render = function(evaluationResult) {
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
        output += template(listTitleTemplate, {title: 'messagesTitle ' + title, value: title});
        messages.forEach(function(message) {
            itemsOutput += template(listItemTemplate, {title: 'message', value: message});
        });
        output += template(listTemplate, {title: 'messages ' + title, items: itemsOutput});
    }
    return output;
};

var renderTree = function(modules, title) {
    var output = '';
    if (modules) {
        output += template(listTitleTemplate, {title: 'moduleTreeTitle ' + title, value: title});
        iteration.forEachModule(modules, function(moduleId, moduleData) {
            var dependenciesOutput = '', moduleOutput = '';
            moduleData.dependencies.forEach(function(dependencyId) {
                dependenciesOutput += template(listItemTemplate, {title: 'dependency', value: dependencyId});
            });
            moduleOutput += template(moduleTitleTemplate, {title: 'moduleId', value: moduleId});
            moduleOutput += template(listTemplate, {title: 'dependencies', items: dependenciesOutput});
            output += template(listItemTemplate, {title: 'module', value: moduleOutput});
        });
        output = template(listTemplate, {title: 'moduleTree ' + title, items: output});
    }
    return output;
};

var renderScripts = function() {
    var jQueryScript = template(externalScriptTemplate, {url: 'http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js'});
    var browserScript = fs.readFileSync(__dirname + '/assets/browser.js', 'utf-8');
    browserScript = template(inlineScriptTemplate, {script: browserScript});
    return jQueryScript + browserScript;
};

var renderStyles = function() {
    var browserStyle = fs.readFileSync(__dirname + '/assets/browser.css', 'utf-8');
    return template(inlineCssTemplate, {style: browserStyle});
}

exports.render = render;