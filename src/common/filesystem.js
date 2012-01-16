var fs = require('fs');

var encoding = 'utf-8';

var readFiles = function(basePath, relativeFilenames) {
    var stat = fs.lstatSync(basePath);
    if (!stat.isDirectory()) {
        throw new Error('invalid base path');
    }
    var files = [];
    relativeFilenames.forEach(function(relativeFilename) {
        files.push({
          relativeFilename: relativeFilename,
          contents: fs.readFileSync(basePath + '/' + relativeFilename, encoding)
        });
    });
    return files;
};

var getAllFiles = function(options, currentPath) {
    currentPath = currentPath ? currentPath + '/' : '';
    var directoriesToExclude = options.directoriesToExclude || [];
    var files = [];
    var fsItems = fs.readdirSync(options.basePath + '/' + currentPath);
    fsItems.forEach(function(fsItem) {
        var relativeItemName = currentPath + fsItem;
        var fullItemName = options.basePath + '/' + relativeItemName;
        var stat = fs.lstatSync(fullItemName);
        var directoryShouldBeExcluded = directoriesToExclude.indexOf(relativeItemName) > -1;
        if (stat.isDirectory()) {
            if (!directoryShouldBeExcluded) {
                files = files.concat(getAllFiles(options, relativeItemName));
            }
        }
        else if (matchesFileEnding(fsItem, options.fileEnding)) {
            files.push(currentPath + fsItem);
        }
    });
    return files;
}

var matchesFileEnding = function(file, ending) {
    if (!ending) {
        return true;
    }
    var endingPlusDot = '.' + ending;
    return file.toLowerCase().indexOf(endingPlusDot) === file.length - endingPlusDot.length;
}

exports.readFiles = readFiles;
exports.getAllFiles = getAllFiles;
exports.matchesFileEnding = matchesFileEnding;