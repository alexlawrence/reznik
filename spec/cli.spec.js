var cli = require('../src/cli.js');

describe('cli.initialize', function() {

    it('should convert command line arguments into string options (starting from index 2)', function() {

        process.argv[2] = '-option=value';
        process.argv[3] = '-option2=value2';

        cli.initialize();
        
        expect(cli.options.option).toBe('value');
        expect(cli.options.option2).toBe('value2');

    });

    it('should set the value of options to "true" if no value is provided', function() {

        process.argv[2] = '-option';

        cli.initialize();

        expect(cli.options.option).toBe('true');

    });

    it('should not add an option if it doesn´t start with "-"', function() {

        process.argv[2] = 'option=value';

        cli.initialize();

        expect(cli.options.option).toBeUndefined();

    });

});