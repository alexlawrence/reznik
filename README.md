reznik.js
=========

Generates AMD dependency lists from existing JavaScript file structures using node.js.

Scenario
--------

When using the Async Module Definition for JavaScript in production you have two possibilities:

* Load each required scripts asynchronously with the help of script loaders (e.g. require.js)
* Use tools such as the r.js optimizer to combine all scripts into one big file

Both ways are valid and have their own use cases.
With reznik.js you additionally have the possibility to load modules and all their dependencies **synchronously**.

How it works
------------

reznik.js generates a list of all in your project existing AMD modules and their dependencies.
It does that by evaluating each module and intercepting the *define()* and *require()* calls.
Additionally it can perform code analysis for missing and circular dependencies.
Whenever a page of your application includes a JavaScript file the server can look up all dependencies in the list and include them also.

Requirements
------------

reznik.js requires an AMD compliant shim such as almond.js for use in production. It also works best when using an
AMD compliant script loader such as require.js in development. This module also requires all of your AMD modules to
have ids matching the filename including the relative path starting from the base path of your JavaScript directory.

Example: 

* Base path for JavaScript: */projects/website/javascripts*
* Absolute module path: */projects/website/javascripts/tools/dom.js*
* Required module id: *tools/dom*

Output
------

The module list can be output as JSON, XML or plain text. It contains all defined modules, all of their dependencies
and all errors occurred during the evaluation.

Example:

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

Command line usage
------------------

For most cases the command line usage is sufficient. Just call *node reznik* with the following options (in the format *-option=value*):

* basePath: The base path to all JavaScript files. Also the base path from which module names are generated. *(required)*
* flatten: Flag to indicate whether all implicit dependencies should be resolved. Makes it easier for your application to
decide which scripts to include *(optional, true/false, default: false)*
* verify: Flag to indicate whether to perform code analysis. Currently implemented: missing dependencies check,
circular dependencies check *(optional, true/false, default: false)*
* output: Output type of the list to generate *(optional, json/xml/plain, default: json)*

Possible command line call:

> node reznik -basePath=/projects/website/javascripts -flatten=true -verify=true -output=xml

Code usage
----------

The module currently only exposes one method: *run(basePath, options)* 

The options are the same as the command line arguments (in the format *{option: value}*).