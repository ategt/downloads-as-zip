import blobToHash from 'blob-to-hash';
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';

import { expect } from 'chai';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import sinon from 'sinon';
import { saveUrls, saveArchive } from './index';
import FileSaver from 'file-saver';

import gasketPng from '!!url-loader!./test-assets/images/gasket.png';
import gasketWebp from '!!url-loader!./test-assets/images/gasket.webp';
import duskJpg from '!!url-loader!./test-assets/images/dusk-sm.jpg';

const convertToBlob = (rawDataString) => {
  const [match, contentType, base64] = rawDataString.match(/^data:(.+);base64,(.*)$/);

  // Convert base64 to a Blob
  // Source: https://stackoverflow.com/a/20151856/626911
  const file = base64toBlob(base64, contentType);

  // Construct a 'change' event with file Blob
  const event = { type: 'change', target: { files: [file] } };

  // Fire the event
  $("#file-chooser").trigger(event);
};

mocha.setup('bdd');

describe('Index', () => {
  describe("Save URL's (saveUrls)", () => {
    let mockSaveAs;

    const mockAdapter = new MockAdapter(axios);

    before(function () {
      mockSaveAs = sinon.stub(FileSaver, "saveAs");
    });

    beforeEach(function () {});

    afterEach(function () {
      mockSaveAs.reset();
    });

    after(function () {
      // Had problems with this being restored after the test timed out,
      // but before the associated promises were resolved, so the actual
      // function was called, instead of a stub, and chaos ensued.
      //
      // Best to leave it off.
      //
      // mockSaveAs.restore();
      mockAdapter.restore();
    });

    const knownUrls = ['http://127.0.0.1:5000/gasket.webp',
                       'http://127.0.0.1:5000/gasket.png',
                       'http://127.0.0.1:5000/dusk-sm.jpg'];

    mockAdapter.onGet('http://127.0.0.1:5000/gasket.webp').reply(200, gasketWebp);
    mockAdapter.onGet('http://127.0.0.1:5000/gasket.png').reply(200, gasketPng);
    mockAdapter.onGet('http://127.0.0.1:5000/dusk-sm.jpg').reply(200, duskJpg);

    // mockAdapter.onGet('http://127.0.0.1:5000/gasket.webp').passThrough();
    // mockAdapter.onGet('http://127.0.0.1:5000/gasket.png').passThrough();
    // mockAdapter.onGet('http://127.0.0.1:5000/dusk-sm.jpg').passThrough();

    it('list of known urls', async () => {
      //mockSaveAs.restore();
      let contentResolver;

      const callWaiter = new Promise((resolve) => {
        contentResolver = resolve;
      });

      mockSaveAs.callsFake(async (content, fileName) => {
        contentResolver(content);
      });

      saveUrls(knownUrls);
      const content = await callWaiter;

      const hash = await blobToHash('sha256', content);
      console.log("Archive Hash", hash);

      const zip = await JSZip.loadAsync(content);
      const sourcesTxt = await zip.file("sources.json").async("string");
      const sources = JSON.parse(sourcesTxt);

      const sourceUrls = new Set(knownUrls);

      const knownFileHases = new Set();
      
      knownFileHases.add("fbab980b5a4fa27fb63365aee3f1ab520b20415e57415b14f8974e1d16267b0e");
      knownFileHases.add("d6aa2111a7b0f97fad96dbba17c7fe9554b132ba3d2be123104851f85e03ca44");
      knownFileHases.add("e42cf4de4a9850cd411c2e99f35339c59760b290d8dc996f265b48bdc81abc00");

      for ( const source of sources ) {
        expect(sourceUrls.has(source.url), "All of the known URLs should appear in the sources list.").equal(true);
        const fileName = source.uuid;
        const file = await zip.file(fileName).async("blob");
        const fileHash = await blobToHash('sha256', file);
        expect(knownFileHases.has(fileHash), "The file name changes, but the hash should be the same.").equal(true);
      }

      expect(content.size, `Created Archive is an unexpected size: ${content.size}`).equal( 330191 );
    });

    it('list of known urls - twice', async function () {
      this.timeout(5000);

      const sizes = new Array();
      let passesAchived;

      const passCounter = new Promise(function (resolve, reject) {
        passesAchived = resolve;
      });

      mockSaveAs.callsFake(async (content, fileName) => {
        sizes.push(content.size);

        if ( sizes.length >= 2 ) {
          passesAchived(sizes);
        }
      });

      saveUrls(knownUrls);
      saveUrls(knownUrls);

      await passCounter;

      expect(sizes[0]).equal(sizes[1]);
    });

    it('list of known urls - differences', async function () {
      this.timeout(5000);

      const sizes = new Array();
      let passesAchived;

      const passCounter = new Promise(function (resolve, reject) {
        passesAchived = resolve;
      });

      mockSaveAs.callsFake(async (content, fileName) => {
        sizes.push(content.size);

        if ( sizes.length >= 2 ) {
          passesAchived(sizes);
        }
      });

      saveUrls(knownUrls.slice(0, 3));
      saveUrls(knownUrls.slice(1, 4));

      await passCounter;

      expect(sizes[0]).not.equal(sizes[1]);
    });
  });
});