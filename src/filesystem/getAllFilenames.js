'use strict';

var fs = require('fs');
var Deferred = require('../../node_modules/Deferred/index.js');
var matchesFileEnding = require('./matchesFileEnding.js');
var when = Deferred.when;

var getAllFilenames = function(options, currentPath) {
    currentPath = currentPath ? currentPath + '/' : '';
    var exclude = options.exclude || [];
    var deferred = new Deferred();
    var recursiveDeferreds = [];
    var filenames = [];
    fs.readdir(options.basePath + '/' + currentPath, function(error, items) {
        items = mapToNames(items, options.basePath, currentPath);
        items = filter(items, exclude, options.fileEnding);
        if (items.length == 0) {
            deferred.resolve(filenames);
        }
        items.forEach(function(item, index) {
            fs.lstat(item.fullName, function(error, stats) {
                if (stats.isDirectory()) {
                    recursiveDeferreds.push(getAllFilenames(options, item.name).then(function(nestedFilenames) {
                        filenames = filenames.concat(nestedFilenames);
                    }));
                }
                else if (matchesFileEnding(item.name, options.fileEnding)) {
                    filenames.push(item.name);
                }

                if (index == items.length - 1) {
                    when.apply({}, recursiveDeferreds).then(function() {
                        deferred.resolve(filenames);
                    });
                }
            });
        });
    });
    return deferred;
};

var mapToNames = function(items, basePath, currentPath) {
    return items.map(function(item) {
        var name = currentPath + item;
        var fullName = basePath + '/' + name;
        return {
            name: name,
            fullName: fullName
        }
    });
};

var filter = function(items, exclude) {
    return items.filter(function(item) {
        var itemShouldBeExcluded = exclude.some(function(value) {
            return item.name.indexOf(value) > -1;
        });
        return !(itemShouldBeExcluded || isInvalidItem(item.fullName));
    });
};

var isInvalidItem = function(fullItemName) {
    return /\/\.$/.test(fullItemName) || /\/\.\.$/.test(fullItemName);
};

module.exports = getAllFilenames;