'use strict';

var fs = require('fs');

var encoding = 'utf-8';

var readFiles = function(basePath, filenames) {
    var stat = fs.lstatSync(basePath);
    if (!stat.isDirectory()) {
        throw new Error('invalid base path');
    }
    var files = [];
    filenames.forEach(function(filename) {
        files.push({
          filename: filename,
          contents: fs.readFileSync(basePath + '/' + filename, encoding)
        });
    });
    return files;
};

module.exports = readFiles;