if (process.argv.length > 0) {

    if (process.argv.length == 2) {
        console.log('Parameters: <mode> <base path> <space separated list of filenames (optional)>');
        process.exit();
    }
    if (process.argv.length < 4) {
        console.log('Invalid count of parameters');
        process.exit();
    }
    exports.active = true;
    exports.flattened = process.argv[2] === 'flattened';
    exports.basePath = process.argv[3];
    exports.relativeFilenames = process.argv.slice(4);
}