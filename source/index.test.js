import { expect } from 'chai';
import sinon from 'sinon';
import { saveUrls, saveArchive } from './index';
import FileSaver from 'file-saver';
import shajs from 'sha.js';

mocha.setup('bdd');

describe('Index', () => {
  describe("Save URL's (saveUrls)", () => {
    let mockSaveAs;

    beforeEach(function () {
      mockSaveAs = sinon.stub(FileSaver, "saveAs");
    });

    afterEach(function () {
      mockSaveAs.restore();
    });

    const knownUrls = ['http://127.0.0.1:5000/gasket-1.webp', 
                       'http://127.0.0.1:5000/gasket-2.webp',
                       'http://127.0.0.1:5000/gasket-3.webp',
                       'http://127.0.0.1:5000/gasket-4.webp'];

    it('list of known urls', (done) => {
      mockSaveAs.callsFake((content, fileName) => {
        const hash = shajs('sha256').update(content).digest('hex');
        console.log("Hash", hash);
        done();
      });

      saveUrls(knownUrls);
    });

    it('list of known urls - twice', function (done) {
      this.timeout(5000);

      const hashes = new Array();

      const passCounter = new Promise(function (resolve, reject) {
        mockSaveAs.callsFake((content, fileName) => {
          const hash = shajs('sha256').update(content).digest('hex');
          hashes.push(hash);
          console.log("Hash", hashes.length, hash);

          if ( hashes.length >= 2 ) {
            resolve(hashes);
          }
        });
      });

      saveUrls(knownUrls);
      saveUrls(knownUrls);

      passCounter.then((hashes) => {
        expect(hashes[0]).equal(hashes[1]);
        done();
      });
    });

    it('list of known urls - differences', async function () {
      this.timeout(5000);

      const hashes = new Array();
      let passesAchived;

      const passCounter = new Promise(function (resolve, reject) {
        passesAchived = resolve;
      });

      mockSaveAs.callsFake((content, fileName) => {
        const hash = shajs('sha256').update(content).digest('hex');
        hashes.push(hash);
        console.log("Diff Hash", hashes.length, hash);

        if ( hashes.length >= 2 ) {
          passesAchived(hashes);
        }
      });

      saveUrls(knownUrls.slice(0, 3));
      saveUrls(knownUrls.slice(1, 4));

      await passCounter;
      //.then((hashes) => {
      expect(hashes[0]).not.equal(hashes[1]);
      //  done();
      //});
    });
  });
});