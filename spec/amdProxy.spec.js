'use strict';

var subject = require('../src/amdProxy.js');
var testId = 'testModule';
var testFilename = 'testModule.js';
var testDependency1 = 'foo';
var testDependency2 = 'bar';

var it_should_add_the_module_with_the_correct_implicit_id_from_the_filename = function() {
    it('should add the module with the correct implicit id from the filename', function() {
        expect(subject.getModules()[testId].id).toBe(testId);
    });
};

var it_should_mark_the_module_as_not_anonymous = function() {
    it('should mark the module as not anonymous', function() {
        expect(subject.getModules()[testId].anonymous).toBeFalsy();
    });
};

var it_should_mark_the_module_as_anonymous = function() {
    it('should mark the module as not anonymous', function() {
        expect(subject.getModules()[testId].anonymous).toBeTruthy();
    });
};

var it_should_add_the_module_dependencies = function() {
    it('should add the module dependencies', function() {
        expect(subject.getModules()[testId].dependencies[0]).toBe(testDependency1);
        expect(subject.getModules()[testId].dependencies[1]).toBe(testDependency2);
    });
};

var it_should_add_the_module_with_the_correct_id = function() {
    it('should add the module with the correct id', function() {
        expect(subject.getModules()[testId].id).toBe(testId);
    });
};

var it_should_add_an_empty_dependencies_array_to_the_module = function() {
    it('should add an empty dependencies array to the module', function() {
        expect(subject.getModules()[testId].dependencies).toBeDefined();
    });
};

var it_should_add_the_module_factory = function(expectedFunction) {
    it('should add the module factory', function() {
        expect(subject.getModules()[testId].factory).toBe(expectedFunction);
    });
};

describe('amdProxy', function() {

    beforeEach(function() {
        subject.setActiveFilename(testFilename);
    });
        
    afterEach(function() {
        subject.reset();
    });

    it('should expose a getModules method', function() {
        expect(subject.getModules).toBeDefined();
    });

    it('should expose a getErrors method', function() {
        expect(subject.getErrors).toBeDefined();
    });

    it('should expose a getConfiguration method', function() {
        expect(subject.getConfiguration).toBeDefined();
    });

    describe('define', function() {

        var testMethod = subject.define;

        it('should expose an amd object on the define method', function() {
            expect(testMethod.amd).toBeDefined();
        });

        it('should add an error when trying to add a module with the same id twice', function() {
            testMethod(testId, function() {});
            testMethod(testId, function() {});

            var errors = subject.getErrors();

            expect(errors[0]).toContain('duplicate module definition');
        });

        describe('when called with an id and a factory', function() {

            var factory = function() { var foo = 'foo'; };

            beforeEach(function() {
                testMethod(testId, factory);
            });

            it_should_add_the_module_with_the_correct_id();
            it_should_add_an_empty_dependencies_array_to_the_module();
            it_should_add_the_module_factory(factory);
            it_should_mark_the_module_as_not_anonymous();

        });

        describe('when called with only a factory and the active filename is set', function() {

            var factory = function() {};

            beforeEach(function() {
                testMethod(factory);
            });

            it_should_add_the_module_with_the_correct_implicit_id_from_the_filename();
            it_should_mark_the_module_as_anonymous();
            it_should_add_an_empty_dependencies_array_to_the_module();
            it_should_add_the_module_factory(factory);
            it('should add the module with the correct filename', function() {
                expect(subject.getModules()[testId].filename).toBe(testFilename);
            });

        });

        describe('when called with an id, a dependencies array and a factory', function() {

            var factory = function() {};

            beforeEach(function() {
                testMethod(testId, [testDependency1, testDependency2], factory);
            });

            it_should_add_the_module_with_the_correct_id();
            it_should_add_the_module_dependencies();
            it_should_add_the_module_factory(factory);

        });

        describe('when called with a dependencies array and a factory', function() {

            var factory = function() {};

            beforeEach(function() {
                testMethod([testDependency1, testDependency2], factory);
            });

            it_should_add_the_module_with_the_correct_implicit_id_from_the_filename();
            it_should_add_the_module_dependencies();
            it_should_add_the_module_factory(factory);

        });

    });

    describe('require', function() {

        var testMethod = subject.require;
        
        describe('when called with only a factory and the active filename is set', function() {

            beforeEach(function() {
                testMethod(function() {});
            });

            it('should not add the module', function() {
                expect(subject.getModules()[testId]).toBeUndefined();
            });

        });

        describe('when called with a factory and a dependencies array and the active filename is set', function() {

            var factory = function() {};

            beforeEach(function() {
                testMethod([testDependency1, testDependency2], factory);
            });

            it_should_add_the_module_with_the_correct_implicit_id_from_the_filename();
            it_should_add_the_module_dependencies();
            it_should_add_the_module_factory(factory);
            it_should_mark_the_module_as_not_anonymous();

        });

    });

    describe('require.config', function() {

        var testMethod = subject.require.config;

        it('should set the configuration to the passed object on initial call', function() {

            testMethod({property: 'value', a: {b: true}});

            var configuration = subject.getConfiguration();

            expect(configuration.property).toBe('value');
            expect(configuration.a.b).toBeTruthy();

        });

        it('should extend the existing configuration by the passed configuration', function() {

            testMethod({a: {a: true, b: false}});
            testMethod({a: {b: true, c: true}});

            var configuration = subject.getConfiguration();

            expect(configuration.a.a).toBeTruthy();
            expect(configuration.a.b).toBeTruthy();
            expect(configuration.a.c).toBeTruthy();

        });

    });

});
