'use strict';

var testMethod = require('../../src/transformation/flattenScriptsList.js');
var firstOrNull = require('../../src/common/firstOrNull.js');
var occurrencesOf = require('../../src/common/occurrencesOf.js');

describe('transformation/flattenScriptsList', function() {

    it('should not add dependencies for scripts without dependencies', function() {

        var scripts = [
            {filename: 'a.js', dependencies: [], type: 'require'},
            {filename: 'b.js', id: 'b', dependencies: [], type: 'module'}
        ];

        var scriptsFlattened = testMethod(scripts);

        expect(scriptsFlattened[0].dependencies.length).toBe(0);
        expect(scriptsFlattened[1].dependencies.length).toBe(0);

    });

    it('should not change dependencies for scripts with only direct dependencies', function() {

        var scripts = [
            {filename: 'a.js', dependencies: ['b'], type: 'require'},
            {filename: 'c.js', id: 'c', dependencies: ['d'], type: 'module'}
        ];

        var scriptsFlattened = testMethod(scripts);

        expect(scriptsFlattened[0].dependencies.length).toBe(1);
        expect(scriptsFlattened[1].dependencies.length).toBe(1);

    });

    it('should add all implicit dependencies to the scripts', function() {

        var scripts = [
            {filename: 'a.js', dependencies: ['b'], type: 'require'},
            {filename: 'b.js', id: 'b', dependencies: ['c'], type: 'module'},
            {filename: 'c.js', id: 'c', dependencies: ['d'], type: 'module'},
            {filename: 'd.js', id: 'd', dependencies: [], type: 'module'}
        ];

        var scriptsFlattened = testMethod(scripts);
        var a = firstOrNull(scriptsFlattened, function(x) { return x.filename == 'a.js'; });

        expect(a.dependencies.length).toBe(3);
        expect(occurrencesOf(a.dependencies, 'b')).toBe(1);
        expect(occurrencesOf(a.dependencies, 'c')).toBe(1);
        expect(occurrencesOf(a.dependencies, 'd')).toBe(1);

    });

    it('should not add duplicates of dependencies to the scripts', function() {

        var scripts = [
            {filename: 'a.js', dependencies: ['b', 'c', 'd'], type: 'require'},
            {filename: 'b.js', id: 'b', dependencies: ['c'], type: 'module'},
            {filename: 'c.js', id: 'c', dependencies: ['d'], type: 'module'},
            {filename: 'd.js', id: 'd', dependencies: [], type: 'module'}
        ];

        var scriptsFlattened = testMethod(scripts);
        var a = firstOrNull(scriptsFlattened, function(x) { return x.filename == 'a.js'; });

        expect(a.dependencies.length).toBe(3);
        expect(occurrencesOf(a.dependencies, 'b')).toBe(1);
        expect(occurrencesOf(a.dependencies, 'c')).toBe(1);
        expect(occurrencesOf(a.dependencies, 'd')).toBe(1);
    });

    it('should keep the scripts file names', function() {

        var scripts = [
            {filename: 'a.js', id: 'a', dependencies: [], type: 'module'},
            {filename: 'b.js', id: 'b', dependencies: [], type: 'module'},
            {filename: 'c.js', id: 'c', dependencies: [], type: 'module'},
            {filename: 'd.js', id: 'd', dependencies: [], type: 'module'}
        ];

        var scriptsFlattened = testMethod(scripts);
        expect(scriptsFlattened.some(function(x) { return x.filename == 'a.js'; })).toBeTruthy();
        expect(scriptsFlattened.some(function(x) { return x.filename == 'b.js'; })).toBeTruthy();
        expect(scriptsFlattened.some(function(x) { return x.filename == 'c.js'; })).toBeTruthy();
        expect(scriptsFlattened.some(function(x) { return x.filename == 'd.js'; })).toBeTruthy();

    });

    it('should take over the scripts anonymous flags', function() {

        var scripts = [
            {filename: 'a.js', id: 'a', anonymous: true, dependencies: [], type: 'module'},
            {filename: 'b.js', id: 'b', anonymous: false, dependencies: [], type: 'module'}
        ];

        var scriptsFlattened = testMethod(scripts);

        var a = firstOrNull(scriptsFlattened, function(x) { return x.id == 'a'; });
        var b = firstOrNull(scriptsFlattened, function(x) { return x.id == 'b'; });
        expect(a.anonymous).toBeTruthy();
        expect(b.anonymous).toBeFalsy();
    });

});
