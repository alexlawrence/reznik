#reznik

Code analysis for projects using [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD).

###Motivation

When using AMD for JavaScript there are mainly two possibilities for production environments:

1. Loading each script asynchronously on demand using script loaders such as require.js
2. Combining all scripts into one file or multiple bundles using build tools such as r.js

Both strategies work perfectly fine. This module was written to fit another (third) use case.
The goal is to be able to resolve individual module dependencies for runtime script combining on the server side.
Whenever modules are requested by an application all their dependencies can be included dynamically.

###Features

Despite the original motivation reznik has some useful code analysis features to offer for projects using AMD.

####Module list

The key functionality is the generation of a list of all modules and their individual dependencies.
This module list can be flattened to include implicit dependencies and it can also be inverted.
Possible output formats are JSON, HTML, dot and plain text (which is heavily optimized for the own use case).
The HTML renderer generates a pretty looking module browser with a simple search functionality.

####Code checks

The generated module list can be used to search for missing and circular dependencies,
case mismatches between module ids and filenames and named modules which cannot be loaded
due to missing or wrong configuration in the script loader (currently only require.config.paths supported).

###Environment

reznik was developed in Node.js using Jasmine specs for testing. However it can also be executed in PhantomJS.
This is because although the Node environment can execute any JavaScript code
it does not exactly behave like browser nor does it have a document or window object by default.
In order to prevent creating a fake browser context for Node this module was extended to be compatible with PhantomJS.

Individual module evaluation is aborted on encountering a script error.
When using Node all define() and require() calls preceeded by any browser specific code cannot be detected.
Example for an unsupported call:

```javascript
(function() {

    var body = document.getElementsByTagName('body').item(0);
    define('someModule', function() {
        return {};
    });

}());
```

Therefore the recommended environment is PhantomJS.

###Restrictions

- Infinite loops in module code will cause the evaluation to freeze
- Module factories are not evaluated, nested require() calls are therefore not detected
- Loader plugins are unsupported and will produce evaluation errors (ignoring them may be implemented at some point)

###Command line usage

Command line options:

* **basePath**: Absolute or relative base path to all JavaScript files *(required)*
* **flatten**: Flag to indicate if a flattened module list should be generated*(optional, true, default: false)*
* **invert**: Flag to indicate if an inverted module list should be generated*(optional, true, default: false)*
* **analysis**: List or single string of code analysis types to perform *(optional, all/missing/circular/case/paths, default: null)*
* **output**: Output type *(optional, json/plain/html/dot, default: json)*
* **exclude**: List or single string to match against all files and directories. All matches are excluded from the evaluation. *(optional, default: null)*
* **help**: Display the help

Example PhantomJS call generating a module browser including a flattened module list which is output to a HTML file:

    phantomjs reznik\src\phantom.js -basePath=/absolute/or/relative/path -flatten=true -output=html > browser.html

Example Node.js call executing all code analysis generating a JSON output to the standard output:

    phantomjs reznik\src\phantom.js -basePath=/absolute/or/relative/path -analysis=all -output=html

###Code usage

The module exposes one only method: *run(basePath, options)*.
The options object accepts the same options as the command line call (using object notation).