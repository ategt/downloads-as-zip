import { expect } from 'chai';
import sinon from 'sinon';
import { saveUrls, saveArchive } from './index';
import FileSaver from 'file-saver';

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
      // Had problems with this being restored after the test timed out,
      // but before the associated promises were resolved, so the actual
      // function was called, instead of a stub, and chaos ensued.
      //
      // Best to leave it off.
      //
      // mockSaveAs.restore();
    });

    const knownUrls = ['http://127.0.0.1:5000/gasket-1.webp', 
                       'http://127.0.0.1:5000/gasket-2.webp',
                       'http://127.0.0.1:5000/gasket-3.webp',
                       'http://127.0.0.1:5000/gasket-4.webp'];

    it('list of known urls', (done) => {
      mockSaveAs.callsFake(async (content, fileName) => {
        expect(content.size, content.size).equal(2739689);
        done();
      });

      saveUrls(knownUrls);
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