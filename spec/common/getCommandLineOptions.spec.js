'use strict';

var testMethod = require('../../src/common/getCommandLineOptions.js');

var setArgvTo = function(array) {
    array = ['node', 'executedScript.js'].concat(array);
    process.argv = array;
}

describe('common/getCommandLineOptions', function() {

    it('should convert command line arguments into string options', function() {

        setArgvTo(['-option=value', '-option2=value2']);

        var options = testMethod();

        expect(options.option).toBe('value');
        expect(options.option2).toBe('value2');

    });

    it('should set an option value to true when no value is provided', function() {

        setArgvTo(['-option']);

        var options = testMethod();

        expect(options.option).toBeTruthy();

    });

    it('should convert an option value to bool when "true" is provided', function() {

        setArgvTo(['-option=true']);

        var options = testMethod();

        expect(options.option).toBeTruthy();

    });

    it('should convert an option value to bool when "false" is provided', function() {

        setArgvTo(['-option=false']);

        var options = testMethod();

        expect(options.option).toBeFalsy();

    });

    it('should not add an option when it does not start with "-"', function() {

        setArgvTo(['option=value']);

        var options = testMethod();

        expect(options.option).toBeUndefined();

    });

    it('should convert a comma separated list into an array', function() {

        setArgvTo(['-excludeDirectories=_cache,search']);

        var options = testMethod();

        expect(Array.isArray(options.excludeDirectories)).toBeTruthy();
    });

});