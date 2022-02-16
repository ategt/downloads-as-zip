import { expect } from 'chai';
import sinon from 'sinon';
import { saveUrls, saveArchive } from './index';
import FileSaver from 'file-saver';
import shajs from 'sha.js';
// import * as main from './index';

// const saveUrls = main.saveUrls; 
mocha.setup('bdd');

describe('Index', () => {
  describe("Save URL's (saveUrls)", () => {
    it('list of known urls', (done) => {
    	//const mockSaveArchive = sinon.replace(FileSaver, "saveAs", sinon.fake());
      //saveArchive = sinon.fake();
      const mockSaveAs = sinon.stub(FileSaver, "saveAs");

    	mockSaveAs.callsFake((content, fileName) => {
        //expect(mockSaveAs.called).to.be.true;
        const hash = shajs('sha256').update(content).digest('hex');
        console.log("Hash", hash);
        done();
      });

      saveUrls(['http://127.0.0.1:5000/gasket-1.webp', 
    			  'http://127.0.0.1:5000/gasket-2.webp',
    			  'http://127.0.0.1:5000/gasket-3.webp',
    			  'http://127.0.0.1:5000/gasket-4.webp']);

    	console.log(mockSaveAs);
      //const x = expect(mockSaveArchive.calledOnce).true();
    });
  });
});