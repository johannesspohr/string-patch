# string-patch

This function can merge two strings that were edited concurrently. So for example, when a user is working in an input and changes are sent from the server, the inputs can be merged.

## Installation

```bash
$ npm install string-patch
```

## Usage

```javascript
import smartMerge from 'string-patch';

var out = smartMerge("Hello, World", "Hello World", "Hello, Darkness"); // "Hello Darkness"
```

In this example, the algorithm merges the deleted comma with the change of the word "World" to "Darkness".
The first parameter is the common base of both changes, the second is the result of the first change. The second parameter is the change that will overwrite the change made first in case of a conflict.

### Pre-ES6

This is compiled using babel, so you have to explicitly reference the default export to get the smartMerge-Function.

```javascript
var smartMerge = require('string-patch').default;

var out = smartMerge("Hello, World", "Hello World", "Hello, Darkness"); // "Hello Darkness"
```

## License

  [MIT](LICENSE)

