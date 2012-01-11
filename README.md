#reznik.js

Generates AMD dependency lists from existing JavaScript file structures.

###Scenario

When using Async Module Definitions for JavaScript there basically two possibilities for production environments:

* Load each required scripts asynchronously with the help of script loaders (e.g. require.js)
* Use tools such as the r.js optimizer on build time to combine all scripts into one big file

Both strategies are valid and have their own use cases.
However with reznik.js you gain the possibility to load modules and all their dependencies **synchronously**.

###How it works

reznik.js runs in node.js and generates a list of all existing AMD modules and their dependencies.
This is done by evaluating each JavaScript file and intercepting the *define()* and *require()* calls.
In addition the module can perform code analysis like searching for missing and circular dependencies.
The list generation is meant to be done on build time or on deployment of an application.
Whenever a page includes a JavaScript all dependencies can be read from the list and can implicitly be included.

###Requirements

reznik.js requires an AMD compliant shim such as almond.js for use in production environment. This setup works best when
using an AMD compliant script loader such as require.js in development environment. All AMD modules must have ids matching
the filename without extension including the relative path starting from the base path of your JavaScript directory.

Example: 
* Base path for JavaScript: */projects/website/javascripts*
* Absolute module path: */projects/website/javascripts/tools/dom.js*
* Required module id: *tools/dom*

###Output

The generated lst can be output as JSON, XML or plain text. It contains all defined modules, all of their dependencies
and all errors occurred during the evaluation.

Example:

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
define('c', function() {
    // factory
});

// JSON output
{
  "modules": {
    "a": ["b", "c"],
    "b": ["d"],
    "c": []
  },
  "errors": [
    "Missing dependency d in b.js"
  ]
}
```

###Command line usage

For most cases the command line tool is sufficient. Just call *node reznik* with the following options (in the format *-option=value*):

* basePath: The base path to all JavaScript files and starting point from which module names are generated. *(required)*
* flatten: Flag to indicate whether all implicit dependencies should be resolved. Makes it easier for an application to
decide which scripts to include *(optional, true/false, default: false)*
* verify: Flag to indicate whether to perform code analysis. Currently implemented: missing dependencies check,
circular dependencies check *(optional, true/false, default: false)*
* output: Output type of the list to generate *(optional, json/xml/plain, default: json)*

Example command line call:

> node reznik -basePath=/projects/website/javascripts -flatten=true -verify=true -output=xml

###Code usage

reznik.js currently only exposes one method: *run(basePath, options)*.
The options are the same as the command line arguments with object notation (*{option: value}*).