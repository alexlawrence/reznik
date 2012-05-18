'use strict';

var amdProxy = require('./amdProxy.js');
var Deferred = require('./common/Deferred.js');

var executionMethod = function(basePath, file, context) {
    throw new Error('no execution method set');
};

var setExecutionMethod = function(newExecutionMethod) {
    executionMethod = newExecutionMethod;
};

var evaluateFiles = function(basePath, filenames) {
    filenames = filenames || [];

    var deferred = new Deferred(), currentFileIndex = 0;
    var start = new Date();
    var context = createContext();

    amdProxy.reset();

    var getResults = function() {
        return {
            scripts: amdProxy.getScripts(),
            errors: amdProxy.getErrors(),
            configuration: amdProxy.getConfiguration(),
            information: getInformation(filenames, start, new Date())
        };
    };

    var evaluateNextFile = function() {
        var filename = filenames[currentFileIndex++];
        amdProxy.setActiveFilename(filename);
        var evaluateFile = executionMethod(basePath, filename, context);
        if (currentFileIndex < filenames.length) {
            evaluateFile.then(evaluateNextFile);
        }
        else {
            evaluateFile.then(function() {
                deferred.resolve(getResults());
            });
        }
    };

    if (filenames.length > 0) {
        evaluateNextFile();
    }
    else {
        deferred.resolve(getResults());
    }

    return deferred;
};

var createContext = function() {
    return {
        define: amdProxy.define,
        require: amdProxy.require
    }
};

var getInformation = function(filenames, start, end) {
    var information = [];
    information.push('evaluated ' + filenames.length + ' files');
    information.push('ran for ' + (end - start) + ' ms');
    return information;
};

exports.evaluateFiles = evaluateFiles;
exports.setExecutionMethod = setExecutionMethod;