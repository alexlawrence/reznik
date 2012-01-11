var fs = require('fs');

var readFiles = function(basePath, relativeFilenames) {
    var stat = fs.lstatSync(basePath);
    if (!stat.isDirectory()) {
        throw new Error('invalid base path');
    }
    var files = [];
    relativeFilenames.forEach(function(relativeFilename) {
        files.push({
          relativeFilename: relativeFilename,
          contents: fs.readFileSync(basePath + '/' + relativeFilename, 'utf-8')
        });
    });
    return files;
};

var getAllFiles = function(basePath, fileEnding) {
    var currentPath = arguments[2] ? arguments[2] + '/' : '';
    var files = [];
    var items = fs.readdirSync(basePath + '/' + currentPath);
    items.forEach(function(item) {
        var stat = fs.lstatSync(basePath + '/' + currentPath + item);
        if (stat.isDirectory()) {
            files = files.concat(getAllFiles(basePath, fileEnding, currentPath + item));
        }
        else {
            if (!fileEnding || item.toLowerCase().indexOf('.' + fileEnding) > 0) {
                files.push(currentPath + item);
            }
        }
    });
    return files;
}

exports.readFiles = readFiles;
exports.getAllFiles = getAllFiles;