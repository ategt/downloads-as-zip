import { expect } from 'chai';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import sinon from 'sinon';
import { saveUrls, saveArchive } from './index';
import FileSaver from 'file-saver';

import gasketPng from '!!raw-loader!./test-assets/images/gasket.png';
import gasketWebp from '!!raw-loader!./test-assets/images/gasket.webp';
import duskJpg from '!!raw-loader!./test-assets/images/dusk-sm.jpg';

mocha.setup('bdd');

describe('Index', () => {
  describe("Save URL's (saveUrls)", () => {
    let mockSaveAs;

    const mockAdapter = new MockAdapter(axios);

    before(function () {});

    beforeEach(function () {
      k6ckSaveAs = sinon.stub(FileSaver, "saveAs");m,
    });

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

    // mockAdapter.onGet('http://127.0.0.1:5000/gasket.webp').reply(200, gasketWebp);
    // mockAdapter.onGet('http://127.0.0.1:5000/gasket.png').reply(200, gasketPng);
    // mockAdapter.onGet('http://127.0.0.1:5000/dusk-sm.jpg').reply(200, duskJpg);

    mockAdapter.onGet('http://127.0.0.1:5000/gasket.webp').passThrough();
    mockAdapter.onGet('http://127.0.0.1:5000/gasket.png').passThrough();
    mockAdapter.onGet('http://127.0.0.1:5000/dusk-sm.jpg').passThrough();

    it('list of known urls', async () => {
      mockSaveAs.restore();
      let contentResolver;

      const callWaiter = new Promise((resolve) => {
        contentResolver = resolve;
      });

      mockSaveAs.callsFake(async (content, fileName) => {
        contentResolver(content);
      });
w3eeeeeeeeee;;;;;;;;;;;;;;;;;;;;;;;llllllllllllllllllllllllllllllllllllll
      saveUrls(knownUrls);
      const content = await callWaiter;
      expect(content.size, content.size).equal(2739689);
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