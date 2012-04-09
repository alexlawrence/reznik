'use strict';

var testMethod = require('../../src/common/extendObject.js');

describe('common/extendObject', function() {

    it('should not throw an error when undefined is passed as extension', function() {

        var left = {}, right;

        expect(function() { testMethod(left, right) }).not.toThrow();

    });

    it('should not modify the object to extend when undefined is passed as extension', function() {

        var left = {property: 'value'}, right;

        testMethod(left, right);

        var propertyCounter = 0;
        for (var property in left) {
            if (left.hasOwnProperty([property])) {
                propertyCounter++;
            }
        }

        expect(propertyCounter).toBe(1);

    });

    it('should not modify the object to extend when a bool is passed as extension', function() {

        var left = {property: 'value'}, right = true;

        testMethod(left, right);

        var propertyCounter = 0;
        for (var property in left) {
            if (left.hasOwnProperty([property])) {
                propertyCounter++;
            }
        }

        expect(propertyCounter).toBe(1);

    });

    it('should not modify the object to extend when a number is passed as extension', function() {

        var left = {property: 'value'}, right = 4.0;

        testMethod(left, right);

        var propertyCounter = 0;
        for (var property in left) {
            if (left.hasOwnProperty([property])) {
                propertyCounter++;
            }
        }

        expect(propertyCounter).toBe(1);

    });

    it('should extend the object to extend by all new properties of the extension', function() {

        var left = {property: 'value'}, right = {newProperty: 'value'};

        testMethod(left, right);

        var propertyCounter = 0;
        for (var property in left) {
            if (left.hasOwnProperty([property])) {
                propertyCounter++;
            }
        }

        expect(propertyCounter).toBe(2);
        expect(left.newProperty).toBe('value');

    });

    it('should overwrite properties of the object to extend with properties of the extension with the same name', function() {

        var left = {property: 'value'}, right = {property: 'newValue'};

        testMethod(left, right);

        var propertyCounter = 0;
        for (var property in left) {
            if (left.hasOwnProperty([property])) {
                propertyCounter++;
            }
        }

        expect(propertyCounter).toBe(1);
        expect(left.property).toBe('newValue');

    });

    it('should extend nested objects of the object to extend with nested object of the extension with the same name', function() {

        var left = {property: {property: 'value'}}, right = {property: {property: 'newValue', newProperty: 'value'}};

        testMethod(left, right);

        expect(left.property.property).toBe('newValue');
        expect(left.property.newProperty).toBe('value');

    });

});