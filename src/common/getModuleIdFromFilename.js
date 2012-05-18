'use strict';

var getModuleIdFromFilename = function(filename) {
    return filename.replace(/.js$/i, '').replace(/\\/g, '/');
};

module.exports = getModuleIdFromFilename;