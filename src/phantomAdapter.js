(function(global) {

    var phantomRequire = global.require;

    var filesystem = phantomRequire('fs');
    filesystem.readdirSync = filesystem.list;
    filesystem.readFileSync = filesystem.read;
    filesystem.lstatSync = function(path) {
        return {
            isDirectory: function() {
                return filesystem.isDirectory(path);
            }
        }
    };

    var currentRelativePath = phantom.libraryPath;
    var moduleCache = {};

    global.process = {
        exit: phantom.exit,
        argv: ['phantomjs', 'phantomAdapter.js'].concat(phantom.args)
    };

    global.require = function(filepath) {
        if (filepath == 'webpage' || filepath == 'system') {
            return phantomRequire(filepath);
        }
        if (filepath == 'fs') {
            return filesystem;
        }
        var lastSeparator = filepath.lastIndexOf('/');
        var filename = filepath.substring(lastSeparator + 1);
        var path = filepath.substring(0, lastSeparator + 1);
        return moduleCache[filename] || loadModule(path, filename);
    };

    var loadModule = function(path, filename) {
        var previousRelativePath = currentRelativePath;
        global.__dirname = currentRelativePath = currentRelativePath + path;
        var code = filesystem.read(currentRelativePath + filename);
        moduleCache[filename] = createModule(filename, code);
        global.__dirname = currentRelativePath = previousRelativePath;
        return moduleCache[filename];
    };

    var createModule = function(filename, code) {
        var module = {exports: {}};
        var exports = module.exports;
        eval(code);
        return module.exports;
    };

}(this));

require('./index.js');

process.exit();