(function(global) {

    var phantomRequire = global.require;

    var filesystem = phantomRequire('fs');
    filesystem.readdirSync = filesystem.list;
    filesystem.readdir = function(dirname, callback) {
        callback(undefined, filesystem.list(dirname));
    };
    filesystem.readFileSync = filesystem.read;
    filesystem.readFile = function(filename, encoding, callback) {
        callback(undefined, filesystem.read(filename));
    };
    filesystem.lstat = function(path, callback) {
        callback(undefined, {
            isDirectory: function() {
                return filesystem.isDirectory(path);
            }
        });
    };

    var currentPath = phantom.libraryPath + '/';
    var moduleCache = {};

    var parentPathRegex = /\/(\w*)\/\.\./;

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
        var path = filepath.substring(0, lastSeparator + 1);
        var filename = completeFilename(filepath.substring(lastSeparator + 1));

        //noinspection UnnecessaryLocalVariableJS
        var previousPath = currentPath;
        addToCurrentPath(path);
        var module = loadModule(filename);
        setCurrentPathTo(previousPath);

        return module;
    };

    var completeFilename = function(filename) {
        if (filename.toLowerCase().lastIndexOf('.js') != filename.length - 3) {
            filename = filename + '.js';
        }
        return filename;
    };

    var addToCurrentPath = function(path) {
        path = removeCurrentDirectory(path);
        currentPath = replaceRelativePaths(currentPath + path);
        global.__dirname = currentPath;
    };

    var loadModule = function(filename) {
        var fullLocation = currentPath + filename;
        if (!moduleCache[fullLocation]) {
            var code = filesystem.read(fullLocation);
            moduleCache[fullLocation] = createModule(code);
        }
        return moduleCache[fullLocation];
    };

    var setCurrentPathTo = function(path) {
        global.__dirname = currentPath = path;
    };

    var removeCurrentDirectory = function(path) {
        return path.replace(/^\.\//g, '');
    };

    var replaceRelativePaths = function(path) {
        while (parentPathRegex.test(path)) {
            path = path.replace(parentPathRegex, '');
        }
        return path;
    };

    var createModule = function(code) {
        var module = {exports: {}};
        var exports = module.exports;
        eval(code);
        return module.exports;
    };

}(this));

require('./index.js').then(function() {
    process.exit();
});