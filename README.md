#reznik

reznik analyzes dependencies for [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) modules and can output the results
as JSON, dot, plain text or as an HTML based module browser.

###Code checks

The evaluated modules can be checked for:

- duplicate module ids
- circular module dependencies
- missing module dependencies
- case mismatches between file names and module IDs (module IDs are case sensitive while server file names are not)
- non anonymous module IDs which differ from the file name but have no loader config (currently only require.js supported)

###Evaluation

Instead of parsing JavaScript reznik actually executes code using either NodeJS or PhantomJS.
In both environments each individual file evaluation is aborted silently upon encountering any script error.
When executed in NodeJS all define() and require() calls preceded by any browser specific code are not detected.
Therefore the recommended execution environment is PhantomJS (see command line usage).

###Restrictions

- **Infinite loops in module code will cause the evaluation to freeze**
- Module factories are not evaluated, therefore nested require() calls are not detected
- Loader plugins are unsupported and will produce evaluation errors (ignoring them may be implemented at some point)

###Command line usage

Available options:

* **basePath**: Absolute or relative base path to all JavaScript files *(required)*
* **flatten**: Flag to indicate if a flattened module list should be generated *(optional, value: true, default: false)*
* **invert**: Flag to indicate if an inverted module list should be generated *(optional, value: true, default: false)*
* **analysis**: List or single string of code analysis types to perform *(optional, values: all/missing/circular/cases/paths/duplicates, default: null)*
* **output**: Output type *(optional, values: json/plain/browser/dot, default: json)*
* **exclude**: List or single string to match against files and directories. Matches are excluded from evaluation. *(optional, default: null)*
* **help**: Display the help

Example PhantomJS call generating a module browser including a flattened module list which is output to an HTML file:

    phantomjs reznik/src/phantomAdapter.js -basePath=reznik/example -flatten=true -output=browser > browser.html

Example NodeJS call executing every code analysis and generating a JSON output excluding all spec files:

    node reznik -basePath=reznik/example -analysis=all -output=json -exclude=spec.js

###Module usage

When required in Node.js reznik exposes only the method *run(options)*.
The options object can consist of the same arguments as the command line does.
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