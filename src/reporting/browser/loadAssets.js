'use strict';

var fs = require('fs');
var Deferred = require('../../common/Deferred.js');

var loadAssets = new Deferred();
var path = __dirname + '/assets/';
var assets = {};
var assetsToLoad = [
    {key: 'jQuery', filename: 'jquery-1.7.1.min.js'},
    {key: 'search', filename: 'search.js'},
    {key: 'css', filename: 'browser.css'}
];

var allAssetsLoaded = function() {
    return assetsToLoad.every(function(x) { return assets[x.key] !== undefined; });
};

assetsToLoad.forEach(function(x) {
    fs.readFile(path + x.filename, 'utf-8', function(error, contents) {
        assets[x.key] = contents;
        if (allAssetsLoaded()) {
            loadAssets.resolve(assets);
        }
    });
});

module.exports = loadAssets;