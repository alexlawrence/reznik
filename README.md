# reznik

reznik analyzes dependencies for [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) modules and outputs the results
as JSON, dot, plain text or as an HTML based module browser.

**Important:** Version 1.3.0 drops PhantomJS support.

### Code checks

The evaluated modules can be checked for:

- duplicate module ids
- circular module dependencies
- missing module dependencies
- case mismatches between file names and module IDs (module IDs are case sensitive while server file names are not)
- non anonymous module IDs which differ from the file name but have no loader config (currently only require.js supported)

### Evaluation

Instead of parsing JavaScript with regular expressions reznik executes and intercepts code using node´s vm module.
Each individual file evaluation is aborted silently upon encountering any script error.

### Restrictions

- **Infinite loops in module code will cause the evaluation to freeze**
- Module factories are not evaluated, therefore nested require() calls are not detected
- Loader plugins are unsupported and will produce evaluation errors (ignoring them may be implemented at some point)
- define() and require() calls preceded by any browser specific code are not detected

### Command line usage

Enter ```node reznik --help``` to see a detailed usage description.

### Module usage

When required as a module reznik exposes only one method: *run(options)*.
The options object accepts the same arguments as the command line does.
The return value is a [promise](http://wiki.commonjs.org/wiki/Promises/A)
which delivers the evaluation results by default as an object.

#### Example JSON output

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
