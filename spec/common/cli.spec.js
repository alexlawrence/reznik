'use strict';

var cli = require('../../src/common/cli.js');

describe('cli', function() {

    describe('argumentsToOptions', function() {

        it('should convert command line arguments into string options', function() {

            var args = ['-option=value', '-option2=value2'];

            var options = cli.argumentsToOptions(args);

            expect(options.option).toBe('value');
            expect(options.option2).toBe('value2');

        });

        it('should set an option value to true if no value is provided', function() {

            var args = ['-option'];

            var options = cli.argumentsToOptions(args);

            expect(options.option).toBeTruthy();

        });

        it('should convert an option value to bool if "true" is provided', function() {

            var args = ['-option=true'];

            var options = cli.argumentsToOptions(args);

            expect(options.option).toBeTruthy();

        });

        it('should convert an option value to bool if "false" is provided', function() {

            var args = ['-option=false'];

            var options = cli.argumentsToOptions(args);

            expect(options.option).toBeFalsy();

        });

        it('should not add an option if it does not start with "-"', function() {

            var args = ['option=value'];

            var options = cli.argumentsToOptions(args);

            expect(options.option).toBeUndefined();

        });

        it('should convert a comma separated list into an array', function() {

            var args = ['-excludeDirectories=_cache,search'];

            var options = cli.argumentsToOptions(args);

            expect(Array.isArray(options.excludeDirectories)).toBeTruthy();
        });

    });

});