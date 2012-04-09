'use strict';

var testMethod = require('../../src/iteration/forEachProperty.js');

describe('iteration/forEachProperty', function() {

    it('should call the callback for every own property of a given object', function() {

        var counter = 0;
        var incrementCounter = function() {
            counter++;
        };
        var input = {property1: 'value1', property2: 'value2', property3: 'value3'};

        testMethod(input, incrementCounter);

        expect(counter).toBe(3);

    });


    it('should pass the value, the property name and the object itself to the callback', function() {

        var spy = jasmine.createSpy('forEachProperty');
        var object = {property1: 'value1', property2: 'value2', property3: 'value3'};

        testMethod(object, spy);

        expect(spy).toHaveBeenCalledWith('value1', 'property1', object);

    });

});