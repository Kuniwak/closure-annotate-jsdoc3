closure-annotate-jsdoc3
=======================

Abstract
--------
The is a [Jsdoc3](https://github.com/jsdoc3/jsdoc) plugin makes [Closure Library](https://developers.google.com/closure/library/) (and [Closure Compiler](https://developers.google.com/closure/compiler/)) style annotation available.

For example, a script is:

```
goog.provide('foo');


/** @const */
foo.CONST = 'foobar'; // This constant will NOT be listed.
```

then the constant will NOT be documented.
So, this plugin adds namespace annotations then goog.provide founds in your script.

Install
-------
See [Packaging JSDoc 3 Plugins](https://github.com/jsdoc3/jsdoc/tree/master/plugins#packaging-jsdoc-3-plugins).
