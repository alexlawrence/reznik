'use strict';

var testMethod = require('../../src/common/template.js');

describe('common/template', function() {

        it('should return an unmodified template when the template contains no placeholders', function() {

            var template = '<div><span>foobar</span></div>';

            var output = testMethod(template, {});

            expect(output).toBe(template);

        });

        it('should replace a placeholder for a property with the correct value of the given data', function() {

            var template = '<div><span>{property}</span></div>';

            var output = testMethod(template, { property: 'value' });

            expect(output).toBe('<div><span>value</span></div>');

        });

        it('should replace all placeholder occurrences with the correct value of the given data', function() {

            var template = '<div><span>{property}</span><span>{property}</span></div>';

            var output = testMethod(template, { property: 'value' });

            expect(output).toBe('<div><span>value</span><span>value</span></div>');

        });

        it('should not replace a placeholder for a property when the given data does not contain that property', function() {

            var template = '<div><span>{otherProperty}</span></div>';

            var output = testMethod(template, { property: 'value' });

            expect(output).toBe('<div><span>{otherProperty}</span></div>');

        });

        it('should replace {{} with { in order to have the possibility to use braces in templates', function() {

            var template = '<div><span>{{}</span></div>';

            var output = testMethod(template, {});

            expect(output).toBe('<div><span>{</span></div>');

        });

        it('should replace {}} with } in order to have the possibility to use braces in templates', function() {

            var template = '<div><span>{}}</span></div>';

            var output = testMethod(template, {});

            expect(output).toBe('<div><span>}</span></div>');

        });

        it('should not mutate the data object', function() {

            var template = '<div><span></span></div>';
            var data = {'{': 'foobar'};

            var output = testMethod(template, data);

            expect(data['{']).toBe('foobar');
            expect(data['}']).toBeUndefined();

        });

});