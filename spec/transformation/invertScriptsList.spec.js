'use strict';

var testMethod = require('../../src/transformation/invertScriptsList.js');
var firstOrNull = require('../../src/common/firstOrNull.js');

describe('transformation/invertScriptsList', function() {

    it('should return inverted direct dependencies', function() {

        var scripts = [
            {filename: 'a.js', dependencies: ['b', 'c', 'd'], type: 'require'},
            {filename: 'b.js', id: 'b', dependencies: ['c', 'd'], type: 'module'},
            {filename: 'c.js', id: 'c', dependencies: ['d'], type: 'module'},
            {filename: 'd.js', id: 'd', dependencies: [], type: 'module'}
        ];

        var scriptsInverted = testMethod(scripts);
        var a = firstOrNull(scriptsInverted, function(x) { return x.filename == 'a.js'; });
        var b = firstOrNull(scriptsInverted, function(x) { return x.filename == 'b.js'; });
        var c = firstOrNull(scriptsInverted, function(x) { return x.filename == 'c.js'; });
        var d = firstOrNull(scriptsInverted, function(x) { return x.filename == 'd.js'; });

        expect(a.dependencies.length).toBe(0);
        expect(b.dependencies.length).toBe(1);
        expect(c.dependencies.length).toBe(2);
        expect(d.dependencies.length).toBe(3);

    });

    it('should not return inverted implicit dependencies', function() {

        var scripts = [
            {filename: 'a.js', dependencies: ['b'], type: 'require'},
            {filename: 'b.js', id: 'b', dependencies: ['c'], type: 'module'},
            {filename: 'c.js', id: 'c', dependencies: ['d'], type: 'module'},
            {filename: 'd.js', id: 'd', dependencies: [], type: 'module'}
        ];

        var scriptsInverted = testMethod(scripts);
        var a = firstOrNull(scriptsInverted, function(x) { return x.filename == 'a.js'; });
        var b = firstOrNull(scriptsInverted, function(x) { return x.filename == 'b.js'; });
        var c = firstOrNull(scriptsInverted, function(x) { return x.filename == 'c.js'; });
        var d = firstOrNull(scriptsInverted, function(x) { return x.filename == 'd.js'; });

        expect(a.dependencies.length).toBe(0);
        expect(b.dependencies.length).toBe(1);
        expect(c.dependencies.length).toBe(1);
        expect(d.dependencies.length).toBe(1);

    });

    it('should keep the scripts file names', function() {

        var scripts = [
            {filename: 'a.js', dependencies: [], type: 'require'},
            {filename: 'b.js', id: 'b', dependencies: [], type: 'module'},
            {filename: 'c.js', id: 'c', dependencies: [], type: 'module'},
            {filename: 'd.js', id: 'd', dependencies: [], type: 'module'}
        ];

        var scriptsInverted = testMethod(scripts);
        expect(scriptsInverted.some(function(x) { return x.filename == 'a.js'; })).toBeTruthy();
        expect(scriptsInverted.some(function(x) { return x.filename == 'b.js'; })).toBeTruthy();
        expect(scriptsInverted.some(function(x) { return x.filename == 'c.js'; })).toBeTruthy();
        expect(scriptsInverted.some(function(x) { return x.filename == 'd.js'; })).toBeTruthy();

    });

    it('should keep the scripts anonymous flags', function() {

        var scripts = [
            {filename: 'a.js', id: 'a', anonymous: true, dependencies: [], type: 'module'},
            {filename: 'b.js', id: 'b', anonymous: false, dependencies: [], type: 'module'}
        ];

        var scriptsInverted = testMethod(scripts);
        var a = firstOrNull(scriptsInverted, function(x) { return x.filename == 'a.js'; });
        var b = firstOrNull(scriptsInverted, function(x) { return x.filename == 'b.js'; });

        expect(a.anonymous).toBeTruthy();
        expect(b.anonymous).toBeFalsy();

    });

});