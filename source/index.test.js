import blobToHash from 'blob-to-hash';
import JSZip from 'jszip';

import { expect } from 'chai';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import sinon from 'sinon';
import { saveUrls, saveArchive } from './index';
import FileSaver from 'file-saver';

import gasketPng from '!!url-loader!./test-assets/images/gasket.png';
import gasketWebp from '!!url-loader!./test-assets/images/gasket.webp';
import duskJpg from '!!url-loader!./test-assets/images/dusk-sm.jpg';

import { convertToBlob } from './test-helpers';

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

    const knownUrls = ['http://127.0.0.1/gasket.webp',
                       'http://127.0.0.1/gasket.png',
                       'http://127.0.0.1/dusk-sm.jpg'];

    mockAdapter.onGet('http://127.0.0.1/gasket.webp').reply(200, convertToBlob(gasketWebp));
    mockAdapter.onGet('http://127.0.0.1/gasket.png').reply(200, convertToBlob(gasketPng));
    mockAdapter.onGet('http://127.0.0.1/dusk-sm.jpg').reply(200, convertToBlob(duskJpg));

    it('list of known urls', async () => {
      let contentResolver;

      const callWaiter = new Promise((resolve) => {
        contentResolver = resolve;
      });

      mockSaveAs.callsFake(async (content, fileName) => {
        contentResolver(content);
      });

      saveUrls(knownUrls);
      const content = await callWaiter;

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

      expect(content.size, `Created Archive is an unexpected size: ${content.size}`).equal( 330176 );
    });

    it('list of known urls - twice', async function () {
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