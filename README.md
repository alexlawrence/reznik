#reznik

Tool to generate and analyze [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) module dependency lists.

###Why

When using the Async Module Definition there are mainly two possibilities for production environments:

* Load each required script asynchronously with the help of script loaders such as [require.js](http://requirejs.org/)
* Use tools such as the [r.js](https://github.com/jrburke/r.js) optimizer on build time to combine all scripts into one
big file or predefined bundles

Both strategies are valid and have their own use cases.
However with reznik you can extend your application to load any AMD module and all its dependencies **synchronously**.

###Features

The module runs in node.js and generates a list of all existing AMD modules and their dependencies.
This is done by evaluating each JavaScript file and intercepting the *define()* and *require()* calls.
The generation is meant to be done on build time or on deployment of an application.
Whenever a page needs a JavaScript all its dependencies can be read from the list and can implicitly be included.
How this can exactly be implemented depends on your application stack.

Additional features:

* Code analysis to check for missing and circular dependencies and invalid module ids
* Flattened module lists to see implicit dependencies
* Inverted module lists for dependency analysis

###Restrictions

* An AMD compliant shim such as [almond.js](https://github.com/jrburke/almond) is required for use in production environment
* All AMD modules must have ids matching the filename (without extension) including the relative path starting from the base path of your JavaScript directory.
* Only top level *require()* and *define()* calls are supported. No code must be executed before these calls. This is because reznik does not fake any DOM context.
* Code that leads to infinite code execution will cause this module to freeze

#####Example for a valid module id:

* Base path for JavaScript: */projects/website/javascripts*
* Absolute module path: */projects/website/javascripts/tools/dom.js*
* Required module id: *tools/dom*

#####Example for unsupported define call:

```javascript
(function() {

    var body = document.getElementsByTagName('body').item(0); 
    define('someModule', function() {
        return {};
    });

}());
````

When evaluating this file the *define()* call is never reached because accessing a non existing document will produce
an error and cause reznik to stop evaluating. Normally an AMD should not look like this anyways.

###Output

The generated list can be output as JSON or plain text. It contains all defined modules, all of their dependencies,
all errors occurred during the evaluation and some information messages. Depending on the configured options a list
of flattened and/or inverted dependencies will also be included.

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
define('c', function() {
    // factory
});
```

Resulting output:

```javascript
// JSON output
{
  "modules": {
    "a": ["b", "c"],
    "b": ["d"],
    "c": []
  },
  "errors": [
    "missing dependency d in b.js"
  ]
  "information": [
    "processed 3 files",
    "ran 100ms"
  }
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
* **output**: Output type of the list to generate *(optional, json/plain, default: json)*

Example command line call:

    node reznik -basePath=/projects/website/javascripts -flattened=true -inverted=false -verify=true -output=plain

###Code usage

The module only exposes one method: *run(basePath, options)*.
The options are the same as the command line arguments but with object notation (*{option: value}*).