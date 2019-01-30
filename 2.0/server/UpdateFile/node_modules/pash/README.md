# pash [![npm version](https://badge.fury.io/js/pash.png)](https://npmjs.org/package/pash)

Simple and strong password hashing using core node crypto.

```
var pash = require("pash");

pash("password", "salt", callback);
```

Callback will be called with an error, or a derived key buffer.
