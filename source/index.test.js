import { expect } from 'chai';
import sinon from 'sinon';
import { saveUrls, saveArchive } from './index';

mocha.setup('bdd');
let sandbox;

describe('Index', () => {
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
  	sandbox.restore();
  });

  describe("Save URL's (saveUrls)", () => {
    it('list of known urls', () => {
    	const mockSaveArchive = sandbox.stub(saveArchive);
    	saveUrls(['http://127.0.0.1:5000/gasket-1.webp', 
    			  'http://127.0.0.1:5000/gasket-2.webp',
    			  'http://127.0.0.1:5000/gasket-3.webp',
    			  'http://127.0.0.1:5000/gasket-4.webp']);

    	console.log(mockSaveArchive);
    });
});