'use strict';

var subject = require('../../src/execution/nodeExecution.js');

describe('nodeExecution', function() {

    it('should execute the script in its own sandbox without access to node context', function() {

        global.test = false;
        var script = 'global.test = true;'

        subject.execute(script);

        expect(global.test).toBeFalsy();

    });

    it('should not rethrow any errors occurred in the executed script', function() {
        var script = 'window.foobar.foobar = "foobar";'

        expect(function() { subject.execute(script); }).not.toThrow();
    });

    it('should make all given context attributes accessible to the executed script', function() {

        var script = 'value = true;';
        var context = {value: false};

        subject.execute(script, context);

        expect(context.value).toBeTruthy();

    });

    it('should make all given context methods accessible to the executed script', function() {

        var script = 'setValue(true);';
        var value = false;
        var context = {setValue: function(newValue) {
            value = newValue;
        }};

        subject.execute(script, context);

        expect(value).toBeTruthy();

    });

    it ('should abort script execution after the first javascript error', function() {

        var script = 'foobar.foobar.foobar;test.value = true;';
        var context = {value: false};

        subject.execute(script, context);

        expect(context.value).toBeFalsy();

    });

});