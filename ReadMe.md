# Simple URL Saver

### Abstract

This library was designed to be used as a copy-and-paste drop in solution to avoid having to visit several different pages or click on several different download buttons.  

### Quickstart

The best way to use this project is to copy the contents of `dist/globals.js`, and paste it into the desired browser window.  Then pass an array of URLs to be downloaded into `window.saveUrls`.

```js
window.saveUrls(['http://www.example.com/file-a',
				 'http://www.example.com/file-b',
				 'http://www.example.com/file-c']);
````

The browser will download a single archive containing the contents of the URL list, plus a 'sources.json' file.

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

So far, this project is only meant to be used in a browser, so those are the only sort of tests that I am interested in.

My tests all seem to follow the *.test.js pattern, but for the moment, when a new test is added, it can be called anything using any pattern, and will get run after it is added as an import into `source/tests.js`.

Current testing uses Chai/Mocha.  Earlier versions used other testing frameworks, but those have all been abandoned in favor of a single unified strategy.

### Background

I was using this to help learn new languages, so file names are UUIDs, and the source URLs are saved to a 'sources.json' file.  This file can be used to map the UUIDs to source URL, if needed.  Older versions tried to guess file names from URL, but many of the resulting names were incompatible with my filesystem, which resulted in unreachable content.  The UUID solution is more flexible.  I have a python script to extract an archive and convert UUIDs back into appropriate file names [here](http://gist.github.com/5464616).