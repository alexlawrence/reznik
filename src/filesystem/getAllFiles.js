'use strict';

var fs = require('fs');
var matchesFileEnding = require('./matchesFileEnding.js');

var getAllFiles = function(options, currentPath) {
    currentPath = currentPath ? currentPath + '/' : '';
    var exclude = options.exclude || [];
    var files = [];
    var fsItems = fs.readdirSync(options.basePath + '/' + currentPath);
    fsItems.forEach(function(fsItem) {
        var itemName = currentPath + fsItem;
        var fullItemName = options.basePath + '/' + itemName;
        var itemShouldBeExcluded = exclude.some(function(value) {
            return itemName.indexOf(value) > -1;
        });
        if (itemShouldBeExcluded || isInvalidItem(fullItemName)) {
            return;
        }

        var stat = fs.lstatSync(fullItemName);
        if (stat.isDirectory()) {
            files = files.concat(getAllFiles(options, itemName));
        }
        else if (matchesFileEnding(fsItem, options.fileEnding)) {
            files.push(currentPath + fsItem);
        }
    });
    return files;
};

var isInvalidItem = function(fullItemName) {
    return /\/\.$/.test(fullItemName) || /\/\.\.$/.test(fullItemName);
};

module.exports = getAllFiles;