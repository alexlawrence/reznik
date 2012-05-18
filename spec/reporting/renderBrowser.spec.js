'use strict';

var testMethod = require('../../src/reporting/renderBrowser.js');
var waitsForDeferred = require('../waitsForDeferred.js');

describe('reporting/browser/renderBrowser', function() {

    it('should not throw an error when given an empty result object', function() {

        var evaluationResult = {};

        expect(function() {
            testMethod(evaluationResult);
        }).not.toThrow();

    });

    it('should return an unordered list of all errors', function() {

        var evaluationResult = {
            errors: ['error 1', 'error 2']
        };

        waitsForDeferred(testMethod(evaluationResult)).then(function(output) {
            expect(output).toContain(
                '<ul class="messages errors"><li class="message">error 1</li><li class="message">error 2</li></ul>');
        });

    });

    it('should return an unordered list of all information', function() {

        var evaluationResult = {
            information: ['information 1', 'information 2']
        };

        waitsForDeferred(testMethod(evaluationResult)).then(function(output) {
            expect(output).toContain(
                '<ul class="messages information"><li class="message">information 1</li><li class="message">information 2</li></ul>');
        });

    });

    it('should return an unordered list for each script and its dependencies', function() {

        var evaluationResult = {
            scripts: [
                {id: 'a', filename: 'a.js', dependencies: ['b', 'c'], type: 'module'},
                {id: 'd', filename: 'd.js', dependencies: ['e', 'f'], type: 'module'}
            ]
        };

        waitsForDeferred(testMethod(evaluationResult)).then(function(output) {
            expect(output).toContain(
                '<li class="script withDependencies">' +
                    '<span class="scriptTitle"><span class="scriptId">a</span><span class="scriptFilename">a.js</span></span>' +
                    '<ul class="dependencies"><li class="dependency">b</li><li class="dependency">c</li></ul>' +
                '</li>');
            expect(output).toContain(
                '<li class="script withDependencies">' +
                    '<span class="scriptTitle"><span class="scriptId">d</span><span class="scriptFilename">d.js</span></span>' +
                    '<ul class="dependencies"><li class="dependency">e</li><li class="dependency">f</li></ul>' +
                '</li>');
        });

    });

    it('should not add the class "withDependencies" for scripts without dependencies', function() {

        var evaluationResult = {
            scripts: [
                {id: 'e', filename: 'e.js', dependencies: [], type: 'module'}
            ]
        };

        waitsForDeferred(testMethod(evaluationResult)).then(function(output) {
            expect(output).toContain(
                '<li class="script">' +
                    '<span class="scriptTitle"><span class="scriptId">e</span><span class="scriptFilename">e.js</span></span>' +
                    '<ul class="dependencies"></ul>' +
                '</li>');
        });
    });

    it('should return an unordered list for each flattened script and its dependencies', function() {

        var evaluationResult = {
            scriptsFlattened: [
                {id: 'a', filename: 'a.js', dependencies: ['b', 'c'], type: 'module'},
                {id: 'd', filename: 'd.js', dependencies: ['e', 'f'], type: 'module'}
            ]
        };

        waitsForDeferred(testMethod(evaluationResult)).then(function(output) {
            expect(output).toContain(
                '<li class="script withDependencies">' +
                    '<span class="scriptTitle"><span class="scriptId">a</span><span class="scriptFilename">a.js</span></span>' +
                    '<ul class="dependencies"><li class="dependency">b</li><li class="dependency">c</li></ul>' +
                '</li>');
            expect(output).toContain(
                '<li class="script withDependencies">' +
                    '<span class="scriptTitle"><span class="scriptId">d</span><span class="scriptFilename">d.js</span></span>' +
                    '<ul class="dependencies"><li class="dependency">e</li><li class="dependency">f</li></ul>' +
                '</li>');
        });

    });

    it('should return an unordered list for each inverted module and its dependencies', function() {

        var evaluationResult = {
            scriptsInverted: [
                {id: 'a', filename: 'a.js', dependencies: ['b', 'c'], type: 'module'},
                {id: 'd', filename: 'd.js', dependencies: ['e', 'f'], type: 'module'}
            ]
        };

        waitsForDeferred(testMethod(evaluationResult)).then(function(output) {
            expect(output).toContain(
                '<li class="script withDependencies">' +
                    '<span class="scriptTitle"><span class="scriptId">a</span><span class="scriptFilename">a.js</span></span>' +
                    '<ul class="dependencies"><li class="dependency">b</li><li class="dependency">c</li></ul>' +
                    '</li>');
            expect(output).toContain(
                '<li class="script withDependencies">' +
                    '<span class="scriptTitle"><span class="scriptId">d</span><span class="scriptFilename">d.js</span></span>' +
                    '<ul class="dependencies"><li class="dependency">e</li><li class="dependency">f</li></ul>' +
                    '</li>');
        });

    });

});