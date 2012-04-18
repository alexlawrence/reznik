#reznik

Code analysis for [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) projects.

###Motivation

When working with AMD there are mainly two possibilities for production environments:

1. Load modules asynchronously on demand with script loaders such as [require.js](https://github.com/jrburke/requirejs)
2. Combine modules into one file or multiple bundles with build tools like [r.js](https://github.com/jrburke/r.js)

Both strategies work perfectly fine. reznik was written to fit another (third) use case.
The goal is to be able to resolve individual module dependencies for runtime script combining on the server side.
Whenever modules are requested by an application all their dependencies can be included dynamically.

###Features

Despite the original motivation this module has some useful code analysis features for AMD projects.

####Module list

The main functionality is the generation of a list of all modules and their individual dependencies.
This list can be flattened for implicit dependencies and it can also be inverted.
Possible output formats are JSON, HTML, dot and plain text (which is heavily optimized for own use case).
The HTML renderer generates a module browser with a simple search functionality.

####Code checks

The module list can be analyzed in order to find:

- Circular module dependencies
- Missing module dependencies
- Case mismatches between file name and module id (server file names are case insensitive but for module IDs cases matter)
- Non anonymous module IDs which differ from the file name but have no loader configuration (currently only require.js supported)

###Environment

reznik was developed in Node.js but it can also be executed in [PhantomJS](http://www.phantomjs.org/) (>= 1.3.0).
Although the Node environment can execute any JavaScript code it does not exactly behave like browser
nor does it have a document or a window object by default.
In order to prevent creating a fake browser context for Node this module was made compatible with PhantomJS.
For both environments each individual module evaluation is aborted on encountering any script error.

So when executed with Node.js all define() and require() calls preceeded by any browser specific code are not detected.
Example:

```javascript
(function() {

    var body = document.getElementsByTagName('body').item(0);
    define('someModule', function() {
        return {};
    });

}());
```

Therefore the recommended environment is PhantomJS. However note that the execution requires the current working
directory to be writable and creates a temporary file (phantom-js.tmp) for the time of the execution.

###Restrictions

- Infinite loops in module code will cause the evaluation to freeze
- Module factories are not evaluated, therefore nested require() calls are not detected
- Loader plugins are unsupported and will produce evaluation errors (ignoring them may be implemented at some point)

###Command line usage

Available options:

* **basePath**: Absolute or relative base path to all JavaScript files *(required)*
* **flatten**: Flag to indicate if a flattened module list should be generated*(optional, value: true, default: false)*
* **invert**: Flag to indicate if an inverted module list should be generated*(optional, value: true, default: false)*
* **analysis**: List or single string of code analysis types to perform *(optional, values: all/missing/circular/case/paths, default: null)*
* **output**: Output type *(optional, values: json/plain/html/dot, default: json)*
* **exclude**: List or single string to match against files and directories. Matches are excluded from evaluation. *(optional, default: null)*
* **help**: Display the help

Example PhantomJS call generating a module browser including a flattened module list which is output to a HTML file:

    phantomjs reznik/src/phantomAdapter.js -basePath=reznik/example -flatten=true -output=html > browser.html

Example Node.js call executing all code analysis generating a JSON output to the standard output:

    node reznik -basePath=reznik/example -analysis=all -output=html

###Code usage

The Node module exposes one method: *run(basePath, options)*.
The options object accepts the same options as the command line call (using object notation).