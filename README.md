#reznik

Code analysis for [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) projects.

###Motivation

When working with AMD there are mainly two possibilities for production environments:

1. Load modules asynchronously on demand with script loaders such as [require.js](https://github.com/jrburke/requirejs)
2. Combine modules into one file or multiple bundles with build tools like [r.js](https://github.com/jrburke/r.js)

Both strategies work perfectly fine. reznik was written to fit another (third) use case.
The goal is to be able to resolve individual dependencies for runtime script combining on the server side.
Whenever scripts are requested by an application all their dependencies can be included dynamically.

###Features

Despite the original motivation this module delivers some useful code analysis features for AMD projects.

####Module list

reznik generates a list of all modules and require() calls and their individual dependencies.
This list can be flattened to see implicit dependencies and it can also be inverted.
Possible output formats are JSON, dot, plain text (optimized for own use case) and a module browser.

####Code checks

The evaluation results can be analyzed in order to find:

- Duplicate module ids
- Circular module dependencies
- Missing module dependencies
- Case mismatches between file names and module IDs (module IDs are case sensitive while server file names are not)
- Non anonymous module IDs which differ from the file name but have no loader configuration (currently only require.js supported)

###Environment

reznik was developed in Node.js but can also be executed in [PhantomJS](http://www.phantomjs.org/) (>= 1.3.0).
Although the Node environment can execute any JavaScript code it does not exactly behave like a browser
nor does it have a document or window object by default.
Instead of faking a browser context for Node this module was made to be compatible with PhantomJS.

In both environments each individual file evaluation is aborted silently upon encountering any script error.
This behaviour is intended as reznik does not care about errors in the evaluated code.

When executed with Node.js all define() and require() calls preceded by any browser specific code are not detected.
Example:

```javascript
(function() {

    var body = document.getElementsByTagName('body').item(0);
    define('someModule', function() {
        return {};
    });

}());
```

Therefore the recommended environment is PhantomJS.

**Note:** This module is intended to be executed as a synchronous build step.
Although reznik itself works asynchronously the method used for script evaluation in is synchronous.

###Restrictions

- **Infinite loops in module code will cause the evaluation to freeze**
- Module factories are not evaluated, therefore nested require() calls are not detected
- Loader plugins are unsupported and will produce evaluation errors (ignoring them may be implemented at some point)

###Command line usage

Available options:

* **basePath**: Absolute or relative base path to all JavaScript files *(required)*
* **flatten**: Flag to indicate if a flattened module list should be generated*(optional, value: true, default: false)*
* **invert**: Flag to indicate if an inverted module list should be generated*(optional, value: true, default: false)*
* **analysis**: List or single string of code analysis types to perform *(optional, values: all/missing/circular/cases/paths/duplicates, default: null)*
* **output**: Output type *(optional, values: json/plain/browser/dot, default: json)*
* **exclude**: List or single string to match against files and directories. Matches are excluded from evaluation. *(optional, default: null)*
* **help**: Display the help

Example PhantomJS call generating a module browser including a flattened module list which is output to a HTML file:

    phantomjs reznik/src/phantomAdapter.js -basePath=reznik/example -flatten=true -output=browser > browser.html

Example Node.js call executing all code analysis and generating a JSON output excluding all spec files:

    node reznik -basePath=reznik/example -analysis=all -output=json -exclude=spec.js

###Module usage

When required in Node.js reznik exposes the method *run(options)*.
The options object accepts the same arguments as the command line does.
The return value is a [promise](http://wiki.commonjs.org/wiki/Promises/A)
which delivers the evaluation results by default as an object.

####Example JSON output

```javascript
{
    "scripts" : {
        "a.js" : {
            "id" : "a",
            "filename" : "a.js",
            "dependencies" : [ "b" ],
            "type" : "require"
        },
        "b.js" : {
            "id" : "b",
            "filename" : "b.js",
            "dependencies" : [ "c" ],
            "anonymous" : true,
            "type" : "module"
        },
        "c.js" : {
            "id" : "c",
            "filename" : "c.js",
            "dependencies" : [ "named/d" ],
            "anonymous" : false,
            "type" : "module"
        },
        "d.js" : {
            "id" : "named/d",
            "filename" : "d.js",
            "dependencies" : [  ],
            "anonymous" : false,
            "type" : "module"
        }
    },
    "configuration" : { "paths" : { "named/d" : "d" } },
    "errors" : [  ],
    "information" : [
        "evaluated 6 files",
        "ran for 18 ms"
    ]
}
```