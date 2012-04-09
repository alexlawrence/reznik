'use strict';

var testMethod = require('../../src/execution/executeInNode.js');

describe('execution/executeInNode', function() {

    it('should execute the script in its own sandbox without access to node context', function() {

        global.test = false;
        var script = 'global.test = true;'

        testMethod(script);

        expect(global.test).toBeFalsy();

    });

    it('should not rethrow any errors occurred in the executed script', function() {
        var script = 'window.foobar.foobar = "foobar";'

        expect(function() { testMethod(script); }).not.toThrow();
    });

    it('should make all given context attributes accessible to the executed script', function() {

        var script = 'value = true;';
        var context = {value: false};

        testMethod(script, context);

        expect(context.value).toBeTruthy();

    });

    it('should make all given context methods accessible to the executed script', function() {

        var script = 'setValue(true);';
        var value = false;
        var context = {setValue: function(newValue) {
            value = newValue;
        }};

        testMethod(script, context);

        expect(value).toBeTruthy();

    });

    it ('should abort script execution after the first javascript error', function() {

        var script = 'foobar.foobar.foobar;test.value = true;';
        var context = {value: false};

        testMethod(script, context);

        expect(context.value).toBeFalsy();

    });

});