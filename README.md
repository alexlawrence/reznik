#reznik

Tool to analyze [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) structures and dependencies.

###Why

When using the Async Module Definition there are two main possibilities for production environments:

* Load each required script asynchronously with the help of script loaders such as [require.js](http://requirejs.org/)
* Use tools such as the [r.js](https://github.com/jrburke/r.js) optimizer on build time to combine all scripts into one
big file or predefined bundles

Both strategies work perfectly fine. reznik was written to fit another use case.
The goal is to be able to resolve all script dependencies for runtime combining on the server side.
Whenever a page of an application requests a script all its dependencies can be included.

###Features

The module runs in node.js and generates lists of all existing AMD modules and their dependencies.
This is done by evaluating each JavaScript file in a given structure and intercepting the *define()* and *require()* calls.
The generation is meant to be done on build time or on deployment of an application.

Additional features:

* Code analysis to check for missing modules and circular dependencies
* Flattened module lists to see implicit dependencies
* Inverted module lists for dependency analysis
* JSON, dot and plain text output
* HTML module browser

###Restrictions

reznik has some restrictions on using AMD:

* An AMD compliant shim such as [almond.js](https://github.com/jrburke/almond) is required for use in production environment
* Only top level *require()* and *define()* calls are supported. No code should be executed before these calls
* Code that leads to infinite code execution will cause this module to freeze

Example for an unsupported define call:

```javascript
(function() {

    var body = document.getElementsByTagName('body').item(0); 
    define('someModule', function() {
        return {};
    });

}());
```

When evaluating this file the *define()* call is never reached because accessing a non existing document will produce
an error and cause reznik to stop evaluating. Normally an AMD should not look like this anyways.

###Output

The generated list can be output as JSON, plain text, dot file or as an HTML module browser.
Every output contains all defined modules, all of their dependencies, all errors occurred during the evaluation and some information messages.
However Only JSON and plain output are suited for further processing as they contain the full set of information.
The HTML output generates a pretty printed and self contained HTML file with the possibility to search for keywords.
The dot output generates a simplified directed dependencies graph.

Example modules:

```javascript
// a.js
require('a', ['b', 'c'], function() {
    // script
});

// b.js
define('b', ['d'], function() {
    // factory
});

// c.js
define(function() {
    // factory
});
```

Resulting example output:

```javascript
// JSON output
{
  "modules": {
    "a": {
        "filename": "a.js",
        "anonymous": false,
        "dependencies": ["b", "c"],
    }
    "b": {
        "filename": "b.js",
        "anonymous": false,
        "dependencies": ["d"],
    },
    "c": {
        "filename": "c.js",
        "anonymous": true,
        "dependencies": [],
    }
  },
  "modulesFlattened": {
    "a": {
        "filename": "a.js",
        "anonymous": false,
        "dependencies": ["b", "c", "d"],
    }
    "b": {
        "filename": "b.js",
        "anonymous": false,
        "dependencies": ["d"],
    },
    "c": {
        "filename": "c.js",
        "anonymous": true,
        "dependencies": [],
    }
  },
  "errors": [
    "missing dependency d in b.js"
  ]
  "information": [
    "processed 3 files",
    "ran 100ms"
  ]
}
```

###Command line usage

For most cases using command line tool is sufficient. Just call *node reznik* with the following options (in the format *-option=value*):

* **basePath**: The base path to all JavaScript files and starting point from which module ids are generated. *(required)*
* **flattened**: Flag to indicate whether all implicit dependencies should be resolved resulting in a additional flattened
list. Makes it easier for an application to decide which scripts to include *(optional, true/false, default: false)*
* **inverted**: Flag to indicate whether the result should contain an inverted list of all dependencies *(optional, true/false, default: false)*
* **verify**: Flag to indicate whether to perform code analysis. Currently implemented: missing dependencies check,
circular dependencies check *(optional, true/false, default: false)*
* **output**: Output type of the list to generate *(optional, json/plain/html/dot, default: json)*
* **exclude**: A single string or a comma separated list of strings that are matched against all files and directories.
All matches are excluded from the evaluation.

Example command line call:

    node reznik -basePath=/projects/website/javascripts -flattened=true -inverted=false -verify=true -output=plain

###Code usage

The module only exposes one method: *run(basePath, options)*.
The options are the same as the command line arguments but with object notation (*{option: value}*).