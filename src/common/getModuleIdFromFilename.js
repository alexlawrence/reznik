'use strict';

var getIdFromFilename = function(filename) {
    return filename.replace(/.js$/i, '').replace(/\\/g, '/');
};

module.exports = getIdFromFilename;