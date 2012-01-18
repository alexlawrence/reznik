var template = require('../common/template.js');
var forEach = require('../common/objectForEach.js').forEach;

var htmlTemplate = '<!doctype html><html><head><title>module browser</title></head><body>{header}{content}</body></html>';
var listItemTemplate = '<li class="{classAttribute}">{value}</li>';
var listTemplate = '<ul class="{classAttribute}">{items}</ul>';
var listTitleTemplate = '<span class="{classAttribute}">{value}</span>';
var header = '<h1>module browser</h1>';

var render = function(evaluationResult) {
    var output = '';
    output += renderList(evaluationResult.errors, 'errors');
    output += renderList(evaluationResult.information, 'information');
    output += renderTree(evaluationResult.modules, 'modules');
    output += renderTree(evaluationResult.modulesFlattened, 'modulesFlattened');
    output += renderTree(evaluationResult.modulesInverted, 'modulesInverted');
    return template.render(htmlTemplate, {header: header, content: output});
};

var renderList = function(messages, classAttribute) {
    if (!messages) {
        return '';
    }
    var output = '', itemsOutput = '';
    messages.forEach(function(message) {
        itemsOutput += template.render(listItemTemplate, {classAttribute: 'item', value: message});
    });
    output += template.render(listTemplate, {classAttribute: 'list ' + classAttribute, items: itemsOutput});
    return output;
};

var renderTree = function(modules, classAttribute) {
    if (!modules) {
        return '';
    }
    var output = '';
    forEach(modules, function(dependencies, moduleId) {
        var dependenciesOutput = '', moduleOutput = '';
        dependencies.forEach(function(dependencyId) {
             dependenciesOutput += template.render(listItemTemplate, {classAttribute: 'item', value: dependencyId});
        });
        moduleOutput += template.render(listTitleTemplate, {classAttribute: 'title', value: moduleId});
        moduleOutput += template.render(listTemplate, {classAttribute: 'itemList', items: dependenciesOutput});
        output += template.render(listItemTemplate, {classAttribute: 'item', value: moduleOutput});
    });
    output = template.render(listTemplate, {classAttribute: 'tree ' + classAttribute, items: output});
    return output;
}

exports.render = render;