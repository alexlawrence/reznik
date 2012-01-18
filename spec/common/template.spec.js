'use strict';

var subject = require('../../src/common/template.js');

describe('template', function() {

    describe('render', function() {

        it('should return an output equal to the template when given a template without placeholders', function() {

            var template = '<div><span>foobar</span></div>';

            var output = subject.render(template, {});

            expect(output).toBe(template);

        });

        it('should replace a placeholder for a property with the correct value when given data having that property', function() {

            var template = '<div><span>{property}</span></div>';

            var output = subject.render(template, { property: 'value' });

            expect(output).toBe('<div><span>value</span></div>');

        });

        it('should not replace a placeholder for a property when given data without that property', function() {

            var template = '<div><span>{otherProperty}</span></div>';

            var output = subject.render(template, { property: 'value' });

            expect(output).toBe('<div><span>{otherProperty}</span></div>');

        });

        it('should replace {{} with { in order to have the possibility to use braces in templates', function() {

            var template = '<div><span>{{}</span></div>';

            var output = subject.render(template, {});

            expect(output).toBe('<div><span>{</span></div>');

        });

        it('should replace {}} with } in order to have the possibility to use braces in templates', function() {

            var template = '<div><span>{}}</span></div>';

            var output = subject.render(template, {});

            expect(output).toBe('<div><span>}</span></div>');

        });

        it('should not mutate the data object', function() {

            var template = '<div><span></span></div>';
            var data = {'{': 'foobar'};

            var output = subject.render(template, data);

            expect(data['{']).toBe('foobar');
            expect(data['}']).toBeUndefined();

        });

    });

});