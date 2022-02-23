# Simple URL Saver

### Quickstart

This library was designed to be used as a copy-and-paste drop in solution to avoid having to visit several different pages or click on several different download buttons.  As such, the best way to utilize this functionality is to copy the contents of globals.js, found in the `dist` directory, and paste it into the development console of the desired browser window.  Then use the `window.saveUrls` function.

```js
window.saveUrls(['http://www.example.com/file-a',
				 'http://www.example.com/file-b',
				 'http://www.example.com/file-c']);
````

After a moment, the browser will enact a file download, which will be a single archive containing the contents of the files found at the URLs input as arguments.

### Using in Code

First, to install the library:
```sh
npm install url-archiver --save
```

then to use the code in code

```es6
import { saveUrls } from 'url-archiver';

const gallery = document.getElementById("gallery");
const imgs = gallery.getElementsByTagName("img");
saveUrls(imgs.map(img => img.src));
```

### Testing

To run the tests, first build the tests

```sh
npm run test
```

or `test:watch` if you want webpack to monitor and continuous build.

Then open the `tests.html` file in the `dist` folder in a browser window.

So far, this project is only meant to be used in a browser, so those are the only sort of tests that I am interested in.  Node functionality is untested.