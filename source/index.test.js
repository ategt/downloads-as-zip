import { expect } from 'chai';
import sinon from 'sinon';
import { saveUrls, saveArchive } from './index';
import FileSaver from 'file-saver';
import shajs from 'sha.js';
import blobToHash from 'blob-to-hash';

mocha.setup('bdd');

describe('Index', () => {
  describe("Save URL's (saveUrls)", () => {
    let mockSaveAs;

    before(function () {
      mockSaveAs = sinon.stub(FileSaver, "saveAs");
    });

    afterEach(function () {
      mockSaveAs.reset();
    });

    after(function () {
      mockSaveAs.restore();
    });

    const knownUrls = ['http://127.0.0.1:5000/gasket-1.webp', 
                       'http://127.0.0.1:5000/gasket-2.webp',
                       'http://127.0.0.1:5000/gasket-3.webp',
                       'http://127.0.0.1:5000/gasket-4.webp'];

    it('list of known urls', (done) => {
      mockSaveAs.callsFake(async (content, fileName) => {
        const hash = shajs('sha256').update(content).digest('hex');
        const otherHash = await blobToHash('sha256', content);
        console.log("Hash", hash, otherHash);
        done();
      });

      saveUrls(knownUrls);
    });

    it('list of known urls - twice', async function () {
      this.timeout(5000);

      const hashes = new Array();
      const otherHashes = new Array();
      let passesAchived;

      const passCounter = new Promise(function (resolve, reject) {
        passesAchived = resolve;
      });

      mockSaveAs.callsFake(async (content, fileName) => {
        const arrayBuffer = await content.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        const hash = shajs('sha256').update(uint8Array).digest('hex');
        const otherHash = await blobToHash('sha256', content);
        hashes.push(hash);
        otherHashes.push(otherHash);
        console.log("Diff Hash", hashes.length, hash);
        console.log("Other Diff Hash", otherHashes.length, otherHash);

        if ( hashes.length >= 2 ) {
          passesAchived(hashes);
        }
      });

      saveUrls(knownUrls);
      saveUrls(knownUrls);

      await passCounter;
      expect(hashes[0]).equal(hashes[1]);
    });

    it('list of known urls - differences', async function () {
      this.timeout(5000);

      const hashes = new Array();
      const otherHashes = new Array();
      let passesAchived;

      const passCounter = new Promise(function (resolve, reject) {
        passesAchived = resolve;
      });

      mockSaveAs.callsFake(async (content, fileName) => {
        const arrayBuffer = await content.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        const hash = shajs('sha256').update(uint8Array).digest('hex');
        const otherHash = await blobToHash('sha256', content);
        hashes.push(hash);
        otherHashes.push(otherHash);
        console.log("Diff Hash", hashes.length, hash);
        console.log("Other Diff Hash", otherHashes.length, otherHash);

        if ( hashes.length >= 2 ) {
          passesAchived(hashes);
        }
      });

      saveUrls(knownUrls.slice(0, 3));
      saveUrls(knownUrls.slice(1, 4));

      await passCounter;

      expect(otherHashes[0]).not.equal(otherHashes[1]);
      expect(hashes[0]).not.equal(hashes[1]);
    });
  });
});