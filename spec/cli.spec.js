var cli = require('../src/cli.js');

describe('cli', function() {

    describe('argumentsToOptions', function() {

        it('should convert command line arguments into string options (starting from index 2)', function() {

            var args = ['-option=value', '-option2=value2'];

            var options = cli.argumentsToOptions(args);

            expect(options.option).toBe('value');
            expect(options.option2).toBe('value2');

        });

        it('should set the value of options to "true" if no value is provided', function() {

            var args = ['-option'];

            var options = cli.argumentsToOptions(args);

            expect(options.option).toBe('true');

        });

        it('should not add an option if it doesn´t start with "-"', function() {

            var args = ['option=value'];

            var options = cli.argumentsToOptions(args);

            expect(options.option).toBeUndefined();

        });

    });

});